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

        if (playersGameRoom && !playersGameRoom.gameStarted) {
            playersGameRoom.removePlayer(player)
        }
    }

    findMatch(player, gameMode) {
        let gameRoom = this.getOpenGame(gameMode)
        gameRoom.addPlayer(player)

        if (gameRoom.isGameRoomReady()) {
            gameRoom.startGame()
        }

        gameRoom.syncPlayersArrayWithRedux()
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
        newGameRoom.syncPlayersArrayWithRedux()

        this.gameRoomsById[id] = newGameRoom
    }

    cancelPrivateMatch(socket) {
        const gameRoom = this.findPlayersGameRoom(socket)

        if (gameRoom) {
            gameRoom.removePlayer(socket)
            gameRoom.syncPlayersArrayWithRedux()
        }
    }

    //Tries to find and return a game room that needs 1 player to start but saves
    //a refernce to any game room that is open incase there doesn't exist a game room
    //missing only 1 person.
    getOpenGame(gameMode) {
        let numPlayersNeeded = 1

        while (numPlayersNeeded < 4) {
            for (let id in this.gameRoomsById) {
                const gameRoom = this.gameRoomsById[id]
                const gameHasntStarted = !gameRoom.gameStarted 
                const isSameGameMode = gameRoom.gameMode === gameMode 
                const matchesPlayersNeededCriteria = gameRoom.playersNeededToStart - gameRoom.lobby.length === numPlayersNeeded

                const shouldJoinGameRoom =
                    gameHasntStarted
                    && isSameGameMode
                    && matchesPlayersNeededCriteria
    
                if (shouldJoinGameRoom) {
                    return gameRoom
                }
            }

            numPlayersNeeded++
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
