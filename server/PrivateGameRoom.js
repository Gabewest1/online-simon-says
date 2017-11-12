const GameRoom = require("./GameRoom")

class PrivateGameRoom extends GameRoom {
    constructor(id, gameMode) {
        super(id, gameMode)
    }
    endGame() {
        super.endGame()

        super.syncPlayersArrayWithRedux()
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
}

module.exports = PrivateGameRoom
