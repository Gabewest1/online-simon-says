const express = require("express")
const socket = require("socket.io")

const app = express()

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => console.log(`running on port ${PORT}`))

const io = socket(server)

const gameRoomManager = new (require("./GameRoomManager"))(io)

io.on("connection", socket => {
    console.log(`${socket.id} connected to the game`)
    console.log("sockets:", Object.keys(io.sockets.sockets))
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)

        let gameRoom = gameRoomManager.findPlayersGameRoom(socket)

        if (gameRoom) {
            gameRoomManager.cancelSearch(socket)
        }

    })

    socket.on("action", action => {
        console.log("ACTION:", action)
        let gameRoom = gameRoomManager.findPlayersGameRoom(socket)

        switch (action.type) {
            case "server/FIND_MATCH": {
                const { gameMode } = action
                gameRoomManager.findMatch(socket, gameMode)
                break
            }
            case "server/CANCEL_SEARCH": {
                gameRoomManager.cancelSearch(socket)
                break
            }
            // case "server/SET_PLAYER": {
            //     let { player, team, isPlayersTurn } = action
            //     let actionForReducer = {type:"SET_PLAYER", player, team, name: socket.id, isPlayersTurn}
            //     gameRoomManager.messageGameRoom(gameRoom, "action", actionForReducer)
            //     break
            // }
            // case "server/END_TURN": {
            //     gameRoomManager.messageGameRoom(gameRoom, "action", {type: "END_TURN"})
            //     break                
            // } 
            // case "server/SET_OPPONENTS_SELECTION": {
            //     gameRoomManager.messageGameRoom(gameRoom, "action", {type: "SET_OPPONENTS_SELECTION", payload: action.payload})
            //     socket.emit("action", {type: "SET_OPPONENTS_SELECTION", payload: undefined})                
            //     break
            // }
        }
    })
})

module.exports = {
    port: PORT,
    socket: io,
    server,
    gameRoomManager
}
