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
        //Guests and Real Users have different object structures
        player = player.isAGuest ? player : player._doc

        this.players.push(
            Object.assign(
                {},
                player,
                { isEliminated: false },
                { isReady: false }
            )
        )
    }
    removePlayer(player) {
        //This method should only be called for private matches and before they've started
        this.players = this.players.filter(p => p.username !== player.username)        
    }
    playerReady(player) {
        this.players = this.players.map(p => {
            if (p.username === player.username) {
                return Object.assign(p, { isReady: true })
            }

            return p
        })
    }
    playerNotReady(player) {
        this.players = this.players.map(p => {
            if (p.username === player.username) {
                return Object.assign(p, { isReady: false })
            }

            return p
        })
    }
}

module.exports = SimonGame