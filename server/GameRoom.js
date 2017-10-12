class GameRoom {
    constructor(id, gameMode) {
        this.id = id
        this.gameMode = gameMode
        this.playersNeededToStart = gameMode
        this.players = []
        this.eliminatedPlayers = []
        this.gameStarted = false
        this.movesToPerform = []
        this.currentMovesIndex = 0
        this.round = 0
    }
    messageGameRoom(action, filterPlayers) {
        if (filterPlayers) {
            this.players
                .filter(filterPlayers)
                .forEach(player => player.emit("action", action))
        } else {
            this.players.forEach(player => player.emit("action", action))
        }
    }
    addPlayer(player) {
        this.players.push(player)
    }
    removePlayer(playerToRemove) {
        this.players = this.players.filter(player => player !== playerToRemove)
    }
    eliminatePlayer(playerToEliminate) {
        this.players.find(player => player === playerToEliminate).isEliminated = true
    }
    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true

            //Pass the clients an array of players
            const players = this.players.map(socket => Object.assign(socket.player, { isEliminated: false }))

            this.messageGameRoom({ type: "FOUND_MATCH", payload: players })
        }
    }
    isGameRoomReady() {
        return this.players.length === this.playersNeededToStart
    }
}

module.exports = GameRoom
