const GameRoom = require("./GameRoom")
const PrivateGameRoom = require("./PrivateGameRoom")
const createHash = require('hash-generator')

const TWO_PLAYER_GAME = 2
const THREE_PLAYER_GAME = 3
const FOUR_PLAYER_GAME = 4
const PRIVATE_GAME = 5

class GameRoomManager {
    constructor(serverSocket) {
        this.gameRoomsById = {}
        this.socket = serverSocket
    }

    cancelSearch(player) {
        const playersGameRoom = this.findPlayersGameRoom(player)
        playersGameRoom.removePlayer(player)
    }

    findMatch(player, gameMode) {
        let gameRoom = this.getOpenGame(gameMode)
        gameRoom.addPlayer(player)

        if (gameRoom.isGameRoomReady()) {
            gameRoom.startGame()
        }
    }

    createGameRoom(gameMode) {
        const id = createHash(8)
        const newGameRoom = new GameRoom(id, gameMode)

        this.gameRoomsById[id] = newGameRoom

        return newGameRoom
    }

    createPrivateMatch(player) {
        const id = createHash(8)
        const newGameRoom = new PrivateGameRoom(id, PRIVATE_GAME)

        newGameRoom.addPlayer(player)

        this.gameRoomsById[id] = newGameRoom
    }

    getOpenGame(gameMode) {
        for (let id in this.gameRoomsById) {
            const gameRoom = this.gameRoomsById[id]
            const isGameRoomOpen =
                gameRoom.players.length < gameRoom.playersNeededToStart
                && !gameRoom.gameStarted
                && gameRoom.gameMode === gameMode

            if (isGameRoomOpen) {
                return gameRoom
            }
        }

        return this.createGameRoom(gameMode)
    }

    findPlayersGameRoom(player) {
        console.log("LOOKING FOR PLAYERS GAME ROOM:", player.gameRoom)
        let gameRoom

        if (player.gameRoom) {
            const { id } = player.gameRoom

            gameRoom = this.gameRoomsById[id]
        }

        console.log(`${gameRoom ? "found" : "No"} gameroom for player`)

        return gameRoom
    }
}

module.exports = GameRoomManager
