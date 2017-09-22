class GameRoomManager {
    constructor(serverSocket) {
        this.gameRooms = []
        this.gameRoomCounter = 0
        this.socket = serverSocket
    }
    addPlayer(player) {
        let gameRoom = this.getOpenGame()
        gameRoom.players.push(player)
        this.isGameRoomReady(gameRoom)
    }
    addSpectator(spectator) {
        let gameRoom = this.getOpenGame()
        gameRoom.spectators.push(spectator)
    }
    createGameRoom() {
        let newGameRoom = {
            id: this.gameRoomCounter++,
            players: [],
            spectators: [],
            rockPaperScissors: []
        }

        this.gameRooms.push(newGameRoom)

        return newGameRoom
    }
    endGameRoom(gameRoom) {
        gameRoom.players.forEach(player => player.disconnect())
        gameRoom.spectators.forEach(spectator => spectator.disconnect())
        this.gameRooms = this.gameRooms.filter(room => room.id !== gameRoom.id)
    }
    isGameRoomReady(gameRoom) {
        if (gameRoom.players.length === 2) {
            this.messageGameRoom(gameRoom, "action", {type: "FOUND_OPPONENT", payload: true})
        }
    }
    messageGameRoom(gameRoom, eventName, data) {
        gameRoom.players.forEach(player => player.emit(eventName, data))
        gameRoom.spectators.forEach(player => player.emit(eventName, data))
    }
    getOpenGame() {
        for (let i = 0; i < this.gameRooms.length; i++) {
            let currentGameRoom = this.gameRooms[i]

            if (currentGameRoom.players.length < 2) {
                return currentGameRoom
            }
        }

        return this.createGameRoom()
    }
    removePlayer(player) {
        let gameRoom = this.findPlayersGameRoom(player)
        let isPlayer = gameRoom.players.indexOf(player) !== -1 
        let isSpectator = gameRoom.spectators.indexOf(player) !== -1

        if (isPlayer) {
            gameRoom.players = gameRoom.players.filter(person => person !== player)
        }

        if (isSpectator) {
            gameRoom.spectators = gameRoom.spectators.filter(person => person !== player)
        }
    }
    findPlayersGameRoom(player) {
        let gameRoom
        for (let i = 0; i < this.gameRooms.length; i++) {
            let currentRoom = this.gameRooms[i]
            if (currentRoom.players.indexOf(player) >= 0 || currentRoom.spectators.indexOf(player) >= 0) {
                gameRoom = currentRoom
            }
        }

        return gameRoom
    }
}

module.exports = GameRoomManager
