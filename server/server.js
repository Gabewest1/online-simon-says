const express = require("express")
const socket = require("socket.io")
const mongoose = require("mongoose")
const User = require("./User.js")

const app = express()

const db = mongoose.connect("mongodb://gabewest1:490501GG@ds149134.mlab.com:49134/simon-says",{ useMongoClient: true }, () => {
    console.log("MONGOOSE CONNECTED TO THE DATABASE :D")
})

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    User.remove({}, (err) => {
        if (err) console.log(err)
    })

    mongoose.model("Player", {}).remove({}, (err) => {})
})

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => console.log(`running on port ${PORT}`))

const io = socket(server)

const gameRoomManager = new (require("./GameRoomManager"))(io)

io.on("connection", socket => {
    console.log(`${socket.id} connected to the game`)
    console.log("sockets:", Object.keys(io.sockets.sockets))
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} disconnected bc: ${reason}`)

        let gameRoom = gameRoomManager.findPlayersGameRoom(socket)

        if (gameRoom) {
            gameRoomManager.cancelSearch(socket)
        }

    })

    socket.on("action", action => {
        console.log("ACTION:", action)
        let gameRoom = gameRoomManager.findPlayersGameRoom(socket)

        switch (action.type) {
            case "server/LOGIN": {
                const { payload: credentials } = action
                const query = { 
                    "$and": [
                        {"$or": [{ username: credentials.username }, { email: credentials.email }]},
                        { password: credentials.password }
                    ]
                }

                User.findOne(query, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else if (user) {
                        console.log("FOUND USER:", user)
                        const payload = { user }
                        
                        socket.emit("action", { type: "LOGIN_SUCCESS", payload })
                    } else {
                        socket.emit("action", { type: "LOGIN_ERROR", payload: err })
                    }
                    
                })

                break
            }
            case "server/REGISTER": {
                const { payload: credentials } = action
                
                console.log("REGISTERING USER:", credentials)
                new User(credentials).save((err, user) => {
                    if (err) {
                        console.log(err)
                        socket.emit("action", { type: "LOGIN_ERROR", payload: err })
                    } else {
                        console.log("NEW USER:", user)
                        const payload = { user }
                        socket.emit("action", { type: "LOGIN_SUCCESS", payload })
                    }
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
            case "server/ELIMINATE_PLAYER": {
                let nextAction = Object.assign(action, {type: "ELIMINATE_PLAYER"})

                gameRoomManager.messageGameRoom(gameRoom, "action", nextAction)
                break
            }
            case "server/OPPONENT_FINISHED_TURN": {
                let nextAction = Object.assign(action, {type: "OPPONENT_FINISHED_TURN"})

                gameRoomManager.messageGameRoom(gameRoom, "action", nextAction)                
                break
            }
            case "server/ANIMATE_SIMON_PAD": {
                let nextAction = Object.assign(action, {type: "ANIMATE_SIMON_PAD_ONLINE"})

                gameRoom.players.forEach(player => {
                    if (player !== socket) {
                        player.emit("action", nextAction)
                    }
                })

                break
            }
            case "server/ADD_NEXT_MOVE": {
                let nextAction = Object.assign(action, {type: "ADD_NEXT_MOVE"})

                gameRoomManager.messageGameRoom(gameRoom, "action", nextAction)

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
