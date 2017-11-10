class SimonGame {
    constructor() {
        this.players = []
        this.movesToPerform = []
        this.currentMovesIndex = 0
        this.round = 0
        this.timer
        this.performingPlayer
    }
    addPlayer(player) {
        this.players.push(
            Object.assign(
                {},
                player,
                { isEliminated: false },
                { isReady: false }
            )
        )

    }
}

module.exports = SimonGame