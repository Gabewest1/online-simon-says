const GameRoom = require("./GameRoom")

class PrivateGameRoom extends GameRoom {
    constructor(id, gameMode) {
        super(id, gameMode)
    }
    endGame() {
        super.endGame()
        this.syncPlayersWithLobby()
        this.resetGame()
    }
    isGameRoomReady() {
        const thereIsMoreThanOnePlayer = this.game.players.length > 1
        const numPlayersNotReady = this.game.players.filter(player => !player.isReady).length

        return thereIsMoreThanOnePlayer && numPlayersNotReady === 0
    }
    playerReady(playerSocket) {
        this.game.playerReady(playerSocket.player)

        super.syncPlayersArrayWithRedux()

        if (this.isGameRoomReady()) {
            this.startGame()
        }
    }
    playerNotReady(playerSocket) {
        this.game.playerNotReady(playerSocket.player)

        super.syncPlayersArrayWithRedux()
    }
    resetGame() {
        this.game.players.forEach(player => {
            player.isReady = false
            player.isEliminated = false
        })
        this.gameStarted = false
        this.playersReady = []
        this.playersReadyForNextTurn = []
        this.acceptPlayersReadyForNextTurn = false
        this.playersReadyToStart = []
        this.eliminatedPlayers = []
        this.movesToPerform = []
        this.currentMovesIndex = 0
        this.round = 0
    }
    startGame() {
        console.log("STARTING THE GAME, IS IT READY:".yellow, this.gameStarted)
        if (!this.gameStarted) {
            this.gameStarted = true
            this.performingPlayer = this.lobby[0]
            this.gameMode = this.lobby.length
            this.messageGameRoom({ type: "GO_TO_GAME_SCREEN", payload: this.gameMode })
            this.timer = super.startJoinMatchTimer()
        }
    }
    syncPlayersWithLobby() {
        this.game.players.forEach(player => {
            const isPlayerStillInTheLobby = this.lobby.find(playerSocket => playerSocket.player.username === player.username)

            if (!isPlayerStillInTheLobby) {
                this.game.removePlayer(player)
            }
        })
    }

}

module.exports = PrivateGameRoom
