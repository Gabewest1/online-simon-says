class GameRoom {
    constructor(id, gameMode) {
        this.id = id
        this.gameMode = gameMode
        this.playersNeededToStart = gameMode
        this.players = []
        this.playersReady = []
        this.eliminatedPlayers = []
        this.gameStarted = false
        this.movesToPerform = []
        this.currentMovesIndex = 0
        this.round = 0
        this.timer
        this.performingPlayer
    }
    animateSimonPad(pad) {
        const action = { type: "ANIMATE_SIMON_PAD_ONLINE", payload: pad }
        const filterPlayerPerforming = player => player !== this.performingPlayer

        this.messageGameRoom(action, filterPlayerPerforming)
    }
    addNextMove(move) {
        let len = this.movesToPerform.length
        this.movesToPerform.push(move)
        this.messageGameRoom({ type: "ADD_NEXT_MOVE", payload: move })
        console.log("ADDING NEXT MOVE:", move, len, this.movesToPerform.length)
    }
    addPlayer(player) {
        /*** Important to remeber!!! This is where i assign the clients property info about their current game room ***/
        this.players.push(player)

        player.gameRoom = { id: this.id, gameMode: this.gameMode }
        player.isEliminated = false

        const players = this.players.map(socket => Object.assign(socket.player, { isEliminated: false }))
        this.messageGameRoom({ type: "SET_PLAYERS", payload: players })
    }
    eliminatePlayer(playerToEliminate) {
        console.log("ELIMNATING PLAYER:", playerToEliminate.player)
        if (!playerToEliminate.player.isEliminated) {
            playerToEliminate.player.isEliminated = true
            this.eliminatedPlayers.push({ player: playerToEliminate, rounds: this.round })
            this.messageGameRoom({ type: "ELIMINATE_PLAYER", payload: playerToEliminate.player})
            this.updatePlayersStats(playerToEliminate)
        }
    }
    endTurn() {
        if (this.isGameOver()) {
            this.endGame()
        } else {
            this.setNextPlayer()
            this.startNextTurn()
        }
    }
    endGame() {
        this.timer = clearInterval(this.timer)
        this.winner = this.players.filter(({ player }) => !player.isEliminated)[0]
        console.log("ENDING GAME:", this.winner.player.username + " Won!")
        this.messageGameRoom({ type: "SET_WINNER", payload: this.winner.player })
        this.messageGameRoom({ type: "GAME_OVER" })
        this.updatePlayersStats(this.winner, true)
    }
    handleSimonMove(playersMove) {
        this.timer = clearInterval(this.timer)
        this.animateSimonPad(playersMove)

        //If the player performed all their moves then this next move will be
        //the newest move for the next player to perform. This is where the logic
        //for ending the game or moving to the next player turn happens.
        if (!playersMove.isValid) {
            this.eliminatePlayer(this.performingPlayer)
        } else if (this.currentMovesIndex === this.movesToPerform.length) {
            this.addNextMove(playersMove.pad)
        } else {
            this.currentMovesIndex++

            this.listenForNextMove()
        }
    }
    isGameRoomReady() {
        return this.players.length === this.playersNeededToStart
    }
    increaseRound() {
        this.round++
        this.messageGameRoom({ type: "INCREASE_ROUND_COUNTER" })
    }
    isGameOver() {
        const numPlayersLeft = this.playersNeededToStart - this.eliminatedPlayers.length
        console.log("NUMBER OF PLAYERS LEFT:", numPlayersLeft)
        if (numPlayersLeft <= 1) {
            return true
        } else {
            return false
        }
    }
    listenForNextMove() {
        if (this.currentMovesIndex === 0) {
            this.timer = this.startLongTimer()
        } else {
            this.timer = this.startShortTimer()
        }
    }
    messageGameRoom(action, filterPlayers) {
        if (filterPlayers) {
            this.players
                .filter(filterPlayers)
                .forEach(player => player.emit("action", action))
        } else {
            this.players.forEach(player => {
                player.emit("action", action)
            })
        }
    }
    playerLostConnection(thisPlayer) {
        const isPlayerAlreadyEliminated = this.eliminatedPlayers.find(({ player }) => player === thisPlayer)
        console.log("IS PLAYER ALREADY ELIMINATED:", isPlayerAlreadyEliminated)
        if (!this.isGameOver() && !isPlayerAlreadyEliminated) {
            this.eliminatePlayer(thisPlayer)
            this.messageGameRoom({ type: "PLAYER_DISCONNECTED", payload: thisPlayer.player })
            this.removePlayer(thisPlayer)

            if (this.isGameOver()) {
                this.endGame()
            }
        }
    }
    playerTimedOut() {
        console.log("Player timed out:", this.performingPlayer.player.username)
        this.timer = clearInterval(this.timer)
        this.messageGameRoom({ type: "PLAYER_TIMEDOUT" })
        this.eliminatePlayer(this.performingPlayer)
    }
    playerReady(player) {
        if (this.playersReady.indexOf(player) === -1) {
            this.playersReady.push(player)

            if (this.playersReady.length === this.players.length) {
                this.playersReady = []
                this.endTurn()
            }
        }
    }
    removePlayer(playerToRemove) {
        this.players = this.players.filter(player => player !== playerToRemove)
        playerToRemove.gameRoom = undefined
    }
    setNextPlayer() {
        let indexOfCurrentPlayer = this.players.indexOf(this.performingPlayer)
        let counter = 1
        let nextPlayerToPerform = this.players[(indexOfCurrentPlayer + counter) % this.players.length]
        console.log("About to set the next player...", this.playersNeededToStart - this.eliminatedPlayers.length)
        while (nextPlayerToPerform.player.isEliminated) {
            counter++
            nextPlayerToPerform = this.players[(indexOfCurrentPlayer + counter) % this.players.length]
        }

        this.performingPlayer = nextPlayerToPerform
        console.log("NEXT PLAYER TO PERFORM: ", nextPlayerToPerform.player.username)
        this.messageGameRoom({ type: "SET_PERFORMING_PLAYER", payload: this.performingPlayer.player })
    }
    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true

            this.performingPlayer = this.players[0]
            this.messageGameRoom({ type: "FOUND_MATCH" })

            setTimeout(() => this.listenForNextMove(), 1000)
        }
    }
    startNextTurn() {
        console.log("STARTING NEXT PLAYERS TURN:", this.performingPlayer.player.username)
        this.currentMovesIndex = 0
        this.increaseRound()
        this.messageGameRoom({ type: "RESET_TIMER" })
        setTimeout(() => {
            this.messageGameRoom({ type: "START_NEXT_TURN" })
            setTimeout(() => {
                this.listenForNextMove()
            }, 1000)
        }, 1000)
    }
    startLongTimer() {
        let timeTillPlayerTimesout = 15

        return setInterval(() => {
            this.messageGameRoom({ type: "DECREASE_TIMER" })
            timeTillPlayerTimesout--

            if (timeTillPlayerTimesout <= 0) {
                this.playerTimedOut()
            }
        }, 1000)
    }
    startShortTimer() {
        let timeTillPlayerTimesout = 3

        return setInterval(() => {
            timeTillPlayerTimesout--

            if (timeTillPlayerTimesout <= 0) {
                this.playerTimedOut()
            }
        }, 1000)
    }
    updatePlayersStats(player, didWin) {
        //Update players stats as long as they arent a guest
        if (!player.player.isAGuest) {
            let numPlayersBeaten = this.eliminatedPlayers.length
            numPlayersBeaten -= !didWin ? 1 : 0
            let xp = (numPlayersBeaten * 10) + this.round
            xp += didWin ? ((this.gameMode * 5) + 10) : 0
            const stats = { xp, gameMode: this.gameMode, didWin }

            console.log("ABOUT TO UPDATE:", player.player.username)

            player.emit("action", { type: "server/UPDATE_PLAYERS_STATS", payload: stats })
        }
    }
}

module.exports = GameRoom
