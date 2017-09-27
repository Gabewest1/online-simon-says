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

        playersGameRoom.players = playersGameRoom.players.filter(person => person !== player)
    }

    findMatch(player, gameMode) {
        let gameRoom = this.getOpenGame(gameMode)
        gameRoom.players.push(player)
        this.isGameRoomReady(gameRoom)
    }

    createGameRoom(gameMode) {
        const newGameRoom = {
            id: this.gameRoomCounter++,
            gameStarted: false,
            players: [],
            playersReady: [],
            playersNeededToStart: gameMode
        }

        this.gameRooms[gameMode].push(newGameRoom)

        return newGameRoom
    }

    endGameRoom(gameRoom) {
        gameRoom.players.forEach(player => player.disconnect())
        gameRoom.spectators.forEach(spectator => spectator.disconnect())
        this.gameRooms = this.gameRooms.filter(room => room.id !== gameRoom.id)
    }

    isGameRoomReady(gameRoom) {
        if (gameRoom.players.length === gameRoom.playersNeededToStart) {
            this.messageGameRoom(gameRoom, "action", {type: "FOUND_MATCH", payload: true})
        }
    }

    messageGameRoom(gameRoom, eventName, data) {
        gameRoom.players.forEach(player => player.emit(eventName, data))
    }

    getOpenGame(gameMode) {
        const gameRooms = this.gameRooms[gameMode]
        const openGameRoom = gameRooms.find(room => room.players.length < room.playersNeededToStart && !room.gameStarted)

        return openGameRoom || this.createGameRoom(gameMode)
    }

    removePlayer(player) {
        let gameRoom = this.findPlayersGameRoom(player)

        gameRoom.players = gameRoom.players.filter(person => person !== player)
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
