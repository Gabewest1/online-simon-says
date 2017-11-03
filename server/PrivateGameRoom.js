const GameRoom = require("./GameRoom")

class PrivateGameRoom extends GameRoom {
    constructor(id, gameMode) {
        super(id, gameMode)
    }
    isGameRoomReady() {
        const thereIsMoreThanOnePlayer = this.playersRedux.length > 1
        const numPlayersNotReady = this.playersRedux.filter(player => !player.isReady).length

        return thereIsMoreThanOnePlayer && numPlayersNotReady === 0
    }
    playerReady(player) {
        this.playersRedux = this.playersRedux.map(p => {
            if (p.username === player.player.username) {
                return Object.assign(p, { isReady: true })
            }

            return p
        })

        super.syncPlayersArrayWithRedux()

        if (this.isGameRoomReady()) {
            this.startGame()
        }
    }
    playerNotReady(player) {
        console.log("ENTERING PLAYER NOT READY".blue)
        this.playersRedux = this.playersRedux.map(p => {
            console.log(`${player.player.username} === ${p.username}`.america)
            if (p.username === player.player.username) {
                console.log("FOUND PLAYER TO MAKE NOT READY".green)
                return Object.assign(p, { isReady: false })
            }

            return p
        })

        super.syncPlayersArrayWithRedux()
    }
    startGame() {
        console.log("STARTING THE GAME, IS IT READY:".yellow, this.gameStarted)
        if (!this.gameStarted) {
            this.gameStarted = true
            this.performingPlayer = this.players[0]
            this.gameMode = this.players.length
            this.messageGameRoom({ type: "GO_TO_GAME_SCREEN", payload: this.gameMode })
            this.timer = super.startJoinMatchTimer()
        }
    }
}

module.exports = PrivateGameRoom
