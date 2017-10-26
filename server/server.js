const express = require("express")
const mongoose = require("mongoose")
const socket = require("socket.io")
const stopSubmit = require("redux-form").stopSubmit
const User = require("./User.js")
const colors = require("colors")

//constant used in the socket action handlers
const SINGLE_PLAYER = 1

const app = express()

const db = mongoose.connect("mongodb://gabewest1:490501GG@ds149134.mlab.com:49134/simon-says",{ useMongoClient: true }, () => {
    console.log("MONGOOSE CONNECTED TO THE DATABASE :D")
})

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    User.update({ loggedIn: true }, { loggedIn: false }, { multi: true }, (err) => err && console.log(err))
    // User.remove({}, (err) => {
    //     if (err) console.log(err)
    // })

    // mongoose.model("Player", {}).remove({}, (err) => {})
})

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => console.log(`running on port ${PORT}`))

const io = socket(server)

const gameRoomManager = new (require("./GameRoomManager"))(io)

io.on("connection", socket => {
    console.dir(`${socket.id} connected to the game from ip: ${socket.handshake.address}`)
    console.log("sockets:", Object.keys(io.sockets.sockets))
    socket.on("disconnect", reason => {
        console.log(`${socket.id} disconnected bc: ${reason}`)

        let gameRoom = gameRoomManager.findPlayersGameRoom(socket)

        //Cancel matchmaking if player was looking for a match
        if (gameRoom) {
            if(!gameRoom.gameStarted) {
                gameRoomManager.cancelSearch(socket)
            } else {
                gameRoom.playerLostConnection(socket)
            }
        }

        //Logout the player if they are logged in
        if (socket.player && socket.player.loggedIn) {
            User.findOneAndUpdate({ username: socket.player.username }, { loggedIn: false }, (err, user) => {
                if (err) {
                    console.log(err)
                }

                console.log("USER LOGGED OUT:", user)
            })
        }

    })

    socket.on("action", action => {
        console.log("ACTION:", action)

        switch (action.type) {
            case "server/LOGIN": {
                const { payload: credentials } = action
                const query = {
                    $or: [
                        { username: credentials.username },
                        { email: credentials.username }
                    ]
                }

                User.findOne(query, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else if (user && !user.loggedIn && user.validPassword(credentials.password)) {
                        console.log("FOUND USER:", user)
                        user.loggedIn = true
                        user.level = user.calculateLevel(user.xp)
                        socket.player = user

                        socket.emit("action", { type: "LOGIN_SUCCESS", payload: { user }})

                        user.save(err => err && console.log(err))
                    } else {
                        //Need to do something with the errors
                        let errors = {}

                        const foundUser = user && (user.username === credentials.username || user.email === credentials.username)
                        errors.username = !foundUser ? "User not found" : undefined
                        errors.password = foundUser && !user.validPassword(credentials.password) ? "Incorrect password" : undefined
                        errors.loggedIn = foundUser && user.loggedIn ? "User is already logged in" : undefined

                        socket.emit("action", { type: "LOGIN_ERROR", payload: err })
                        socket.emit("action", stopSubmit("signIn", errors))
                    }

                })

                break
            }
            case "server/REGISTER": {
                const { payload: credentials } = action
                const query = { $or: [
                    { username: credentials.username },
                    { email: credentials.email }
                ]}

                User.findOne(query, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else if (user) {
                        let errors = {}

                        errors.username = user.username === credentials.username ? "Username taken" : undefined
                        errors.email = user.email === credentials.email ? "Email taken" : undefined

                        socket.emit("action", { type: "LOGIN_ERROR", payload: err })
                        socket.emit("action", stopSubmit("signUp", errors))
                    } else {
                        const newUser = new User()

                        newUser.username = credentials.username
                        newUser.email = credentials.email
                        newUser.password = newUser.generateHash(credentials.password)
                        newUser.loggedIn = true

                        newUser.save((err, user) => {
                            if (err) {
                                console.log(err)
                                socket.emit("action", { type: "LOGIN_ERROR", payload: err })
                            } else {
                                socket.player = user

                                socket.emit("action", { type: "LOGIN_SUCCESS", payload: { user }})
                            }
                        })
                    }
                    
                })

                break
            }
            case "server/LOGOUT": {
                User.findOneAndUpdate({ username: socket.player.username }, { loggedIn: false }, (err, user) => {
                    if (err) {
                        console.log(err)
                    }

                    console.log("USER LOGGED OUT:", user)
                })

                break
            }
            case "server/FETCH_LEADERBOARD_DATA": {
                User.find({}).sort({"statsByGameMode.1.highScore": -1}).limit(10).exec((err, users) => {
                    if (err) {
                        console.log(err)
                    }

                    console.log("SENDING THE USER LEADERBOARDS:", users)
                    socket.emit("action", { type: "FETCH_LEADERBOARD_DATA_SUCCESS", payload: users })
                })
                break
            }
            case "server/UPDATE_SINGLE_PLAYER_STATS": {
                User.findOne({ username: socket.player.username }, (err, user) => {
                    if (err) {
                        console.log(err)
                    }

                    if (!user) {
                        return
                    }

                    const { round } = action.payload
                    const currentHighScore = user.statsByGameMode[SINGLE_PLAYER].highScore
                    const xpGained = round + (Math.floor(round / 10) * 10)

                    user.xp += xpGained
                    user.level = user.calculateLevel(user.xp)
                    user.statsByGameMode[SINGLE_PLAYER].matchesPlayed += 1
                    user.statsByGameMode[SINGLE_PLAYER].highScore = Math.max(currentHighScore, round)

                    console.log("UPDATED SINGLE PLAYER STATS:".green, xpGained, Math.max(currentHighScore, round))
                    
                    user.save((err, user) => {
                        if (err) {
                            console.log(err)
                        }

                        console.log("SAVED SINGLE PLAYER STATS:")
                        socket.player = user
                        socket.emit("action", { type: "UPDATE_STATS", payload: user })
                    })
                })

                break
            }
            case "server/UPDATE_MULITPLAYER_STATS": {
                User.findOne({ username: socket.player.username }, (err, user) => {
                    if (err) {
                        console.log(err)
                    }

                    if (!user) {
                        return
                    }

                    console.log("DID I MAKE IT THIS FAR".rainbow)

                    const { didPlayerWin, gameMode, xpGained } = action.payload

                    const updateWinsOrLoses = didPlayerWin ? "wins" : "loses"
                    const currentStreak = didPlayerWin ? user.statsByGameMode[gameMode].currentStreak + 1 : 0
                    const currentBestStreak = user.statsByGameMode[gameMode].bestStreak
                    const bestStreak = Math.max(currentStreak, currentBestStreak)

                    user.xp += xpGained
                    user.level = user.calculateLevel(user.xp)
                    user.statsByGameMode[gameMode].matchesPlayed += 1
                    user.statsByGameMode[gameMode][`${updateWinsOrLoses}`] += 1
                    user.statsByGameMode[gameMode].currentStreak = currentStreak
                    user.statsByGameMode[gameMode].bestStreak = bestStreak

                    console.log("UPDATED MULTIPLAYER STATS:".green, didPlayerWin, xpGained, bestStreak)
                    user.save((err, user) => {
                        if (err) {
                            console.log(err)
                        }

                        console.log("SAVED MULTIPLAYER STATS:")
                        socket.player = user
                        socket.emit("action", { type: "UPDATE_STATS", payload: user })
                    })
                })

                break
            }
            case "server/PLAY_AS_GUEST": {
                socket.player = action.payload

                break
            }
            case "server/FIND_MATCH": {
                const { gameMode } = action
                gameRoomManager.findMatch(socket, gameMode)
                break
            }
            case "server/CANCEL_SEARCH": {
                gameRoomManager.cancelSearch(socket)
                break
            }
            case "server/CREATE_PRIVATE_MATCH": {
                gameRoomManager.createPrivateMatch(socket)
                socket.emit("action", { type: "PRIVATE_MATCH_CREATED" })
                break
            }
            case "server/INVITE_PLAYER": {
                const playerToInviteID = Object.keys(io.sockets.sockets).find(socketID => {
                    const socket = io.sockets.sockets[socketID]
                    console.log("SOCKET:", socket.player)
                    return socket.player && socket.player.username.toLowerCase() === action.payload
                })

                if (playerToInviteID) {
                    const playersSocket = io.sockets.sockets[playerToInviteID]
                    const payload = { player: socket.player, gameRoom: socket.gameRoom }
                    playersSocket.emit("action", { type: "RECEIVE_INVITE", payload })
                }
                break
            }
            case "server/JOIN_PRIVATE_MATCH": {
                const gameRoom = gameRoomManager.findPlayersGameRoom(action.payload)
                gameRoom.addPlayer(socket)
                socket.emit("action", { type: "JOINED_PRIVATE_MATCH" })
                break
            }
            case "server/CANCEL_PRIVATE_MATCH": {
                const gameRoom = gameRoomManager.findPlayersGameRoom(socket)
                gameRoom.removePlayer(socket)
                gameRoom.syncPlayersArrayWithRedux()
                break
            }
            case "server/PLAYER_QUIT_MATCH": {
                const gameRoom = gameRoomManager.findPlayersGameRoom(socket)
                gameRoom.playerLostConnection(socket)
                break
            }
            case "server/ANIMATE_SIMON_PAD": {
                let gameRoom = gameRoomManager.findPlayersGameRoom(socket)
                gameRoom.handleSimonMove(action.payload)
                break
            }
            case "server/PLAYER_READY_TO_START": {
                let gameRoom = gameRoomManager.findPlayersGameRoom(socket)
                gameRoom.playerReadyToStart(socket)
                break
            }
            default:
                break
        }
    })
})


module.exports = {
    port: PORT,
    socket: io,
    server,
    gameRoomManager
}
