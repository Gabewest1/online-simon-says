const express = require("express")
const mongoose = require("mongoose")
const socket = require("socket.io")
const stopSubmit = require("redux-form").stopSubmit
const User = require("./User.js")

const app = express()

const db = mongoose.connect("mongodb://gabewest1:490501GG@ds149134.mlab.com:49134/simon-says",{ useMongoClient: true }, () => {
    console.log("MONGOOSE CONNECTED TO THE DATABASE :D")
})

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
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
        if (gameRoom && !gameRoom.gameStarted) {
            gameRoomManager.cancelSearch(socket)
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
                User.find({}).sort({"statsByGameMode.1.bestStreak": -1}).limit(10).exec((err, users) => {
                    if (err) {
                        console.log(err)
                    }

                    console.log("SENDING THE USER LEADERBOARDS:", users)
                    socket.emit("action", { type: "FETCH_LEADERBOARD_DATA_SUCCESS", payload: users })
                })
                break
            }
            case "server/UPDATE_PLAYERS_STATS": {
                User.findOne({ username: socket.player.username }, (err, user) => {
                    if (err) {
                        console.log(err)
                    }

                    if (!user) {
                        return
                    }

                    console.log("UPDATING USER:", user)
                    const stats = action.payload
                    const updateWinsOrLoses = stats.didWin ? "wins" : "loses"
                    const currentStreak = stats.didWin ? user.statsByGameMode[stats.gameMode].currentStreak + 1 : 0
                    const currentBestStreak = user.statsByGameMode[stats.gameMode].bestStreak
                    const bestStreak = Math.max(currentStreak, currentBestStreak)

                    user.xp += stats.xp
                    user.statsByGameMode[stats.gameMode].matchesPlayed += 1
                    user.statsByGameMode[stats.gameMode][`${updateWinsOrLoses}`] += 1
                    user.statsByGameMode[stats.gameMode].currentStreak = currentStreak
                    user.statsByGameMode[stats.gameMode].bestStreak = bestStreak

                    user.save((err, user) => {
                        if (err) {
                            console.log(err)
                        }

                        console.log("Updated users stats:", user)
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
            case "server/ANIMATE_SIMON_PAD": {
                let gameRoom = gameRoomManager.findPlayersGameRoom(socket)
                gameRoom.handleSimonMove(action.payload)
                break
            }
            case "server/READY_FOR_NEXT_TURN": {
                let gameRoom = gameRoomManager.findPlayersGameRoom(socket)
                gameRoom.playerReady(socket)
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
