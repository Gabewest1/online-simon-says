const GameRoom = require("./GameRoom")

const TWO_PLAYER_GAME = 2
const THREE_PLAYER_GAME = 3
const FOUR_PLAYER_GAME = 4
const PRIVATE_GAME = 5

class GameRoomManager {
    constructor(serverSocket) {
        this.gameRooms = {
            [TWO_PLAYER_GAME]: [],
            [THREE_PLAYER_GAME]: [],
            [FOUR_PLAYER_GAME]: []
        }
        this.privateGameRooms = []
        this.gameRoomCounter = 0
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
        const newGameRoom = new GameRoom(this.gameRoomCounter++, gameMode)

        this.gameRooms[gameMode].push(newGameRoom)

        return newGameRoom
    }

    createPrivateMatch(player) {
        const newGameRoom = new GameRoom(this.gameRoomCounter++, PRIVATE_GAME)

        newGameRoom.addPlayer(player)

        this.privateGameRooms.push(newGameRoom)
    }
    
    getOpenGame(gameMode) {
        const gameRooms = this.gameRooms[gameMode]
        const openGameRoom = gameRooms.find(room => room.players.length < room.playersNeededToStart && !room.gameStarted)

        return openGameRoom || this.createGameRoom(gameMode)
    }

    findPlayersGameRoom(player) {
        console.log("LOOKING FOR PLAYERS GAME ROOM:", player.gameRoom)
        let gameRoom
        if (player.gameRoom) {
            const { id, gameMode } = player.gameRoom

            if (gameMode === PRIVATE_GAME) {
                gameRoom = this.privateGameRooms.find(room => room.id === id)
            } else {
                gameRoom = this.gameRooms[gameMode].find(room => room.id === id)
            }

        }
        console.log(`${gameRoom ? "found" : "No"} gameroom for player`)

        return gameRoom
    }
}

module.exports = GameRoomManager
