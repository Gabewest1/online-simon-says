const GameRoom = require("./GameRoom")

const TWO_PLAYER_GAME = 2
const THREE_PLAYER_GAME = 3
const FOUR_PLAYER_GAME = 4

class GameRoomManager {
    constructor(serverSocket) {
        this.gameRooms = {
            [TWO_PLAYER_GAME]: [],
            [THREE_PLAYER_GAME]: [],
            [FOUR_PLAYER_GAME]: []
        }
        this.gameRoomCounter = 0
        this.socket = serverSocket
    }

    cancelSearch(player) {
        const playersGameRoom = this.findPlayersGameRoom(player)
        playersGameRoom.removePlayer(player)
        console.log("ROOMS:", this.gameRooms)        
    }

    findMatch(player, gameMode) {
        let gameRoom = this.getOpenGame(gameMode)
        gameRoom.addPlayer(player)
        console.log("ROOMS:", this.gameRooms)
        if (gameRoom.isGameRoomReady()) {
            gameRoom.startGame()
        }
    }

    createGameRoom(gameMode) {
        const newGameRoom = new GameRoom(this.gameRoomCounter++, gameMode)

        this.gameRooms[gameMode].push(newGameRoom)

        return newGameRoom
    }
    
    getOpenGame(gameMode) {
        const gameRooms = this.gameRooms[gameMode]
        const openGameRoom = gameRooms.find(room => room.players.length < room.playersNeededToStart && !room.gameStarted)

        return openGameRoom || this.createGameRoom(gameMode)
    }

    findPlayersGameRoom(player) {
        let gameRoom = this.gameRooms[TWO_PLAYER_GAME].find(room => room.players.indexOf(player) >= 0)

        if (!gameRoom) {
            gameRoom = this.gameRooms[THREE_PLAYER_GAME].find(room => room.players.indexOf(player) >= 0)
        }

        if (!gameRoom) {
            gameRoom = this.gameRooms[FOUR_PLAYER_GAME].find(room => room.players.indexOf(player) >= 0)
        }

        return gameRoom
    }
}

module.exports = GameRoomManager
