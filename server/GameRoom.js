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
        this.timer
        this.performingPlayer
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
        this.players.push(player)
        player.gameRoom = { id: this.id, gameMode: this.gameMode }
    }
    removePlayer(playerToRemove) {
        this.players = this.players.filter(player => player !== playerToRemove)
    }
    eliminatePlayer(playerToEliminate) {
        console.log("ELIMNATING PLAYER:", playerToEliminate.player)
        playerToEliminate.player.isEliminated = true
        this.eliminatedPlayers.push(playerToEliminate)
        this.messageGameRoom({ type: "ELIMINATE_PLAYER", payload: playerToEliminate.player})
    }
    endTurn() {
        if (this.isGameOver()) {
            this.endGame()
        } else {
            this.setNextPlayer()
            this.startPlayersTurn()
        }
    }
    endGame() {
        const winner = this.players.filter(({ player }) => !player.isEliminated)[0].player
        console.log("ENDING GAME:", winner.username + " Won!")
        this.messageGameRoom({ type: "SET_WINNER", payload: winner})
        this.messageGameRoom({ type: "GAME_OVER" })
        this.players = []
        // this.updatePlayersStats()
    }
    handleFinalMove(playersMove) {
        console.log("Handling the final move")
        this.addNextMove(playersMove.pad)
        this.endTurn()
    }
    handleSimonMove(playersMove) {
        this.timer = clearInterval(this.timer)
        this.animateSimonPad(playersMove)
        //If the player performed all their moves then this next move will be
        //the newest move for the next player to perform. This is where the logic
        //for ending the game or moving to the next player turn happens.
        if (!playersMove.isValid) {
            this.eliminatePlayer(this.performingPlayer)
            this.endTurn()
        } else if (this.currentMovesIndex === this.movesToPerform.length) {
            this.handleFinalMove(playersMove)
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
        const numPlayersLeft = this.players.filter(({ player }) => !player.isEliminated).length
        console.log("NUMBER OF PLAYERS LEFT:", numPlayersLeft)
        if (numPlayersLeft === 1) {
            this.timer = clearInterval(this.timer)

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
    playerTimedOut() {
        console.log("Player timed out:", this.performingPlayer.player.username)
        this.timer = clearInterval(this.timer)
        this.messageGameRoom({ type: "PLAYER_TIMEDOUT" })
        this.eliminatePlayer(this.performingPlayer)
        this.endTurn()
    }
    setNextPlayer() {
        let indexOfCurrentPlayer = this.players.indexOf(this.performingPlayer)
        let counter = 1
        let nextPlayerToPerform = this.players[(indexOfCurrentPlayer + counter) % this.players.length]
        console.log("About to set the next player...", this.players.map(player => player.player))
        while (nextPlayerToPerform.player.isEliminated) {
            counter++
            nextPlayerToPerform = this.players[(indexOfCurrentPlayer + counter) % this.players.length]
        }

        this.performingPlayer = nextPlayerToPerform
        console.log("NEXT PLAYER TO PERFORM: ", nextPlayerToPerform.player)
        this.messageGameRoom({ type: "SET_PERFORMING_PLAYER", payload: this.performingPlayer.player })
    }
    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true

            //Pass the clients an array of players
            const players = this.players.map(socket => Object.assign(socket.player, { isEliminated: false }))

            this.performingPlayer = this.players[0]
            this.messageGameRoom({ type: "FOUND_MATCH", payload: players })
            setTimeout(() => {
                this.listenForNextMove()
            }, 1000)
        }
    }
    startPlayersTurn() {
        console.log("STARTING NEXT PLAYERS TURN:", this.performingPlayer.player.username)
        this.currentMovesIndex = 0
        this.increaseRound()
        this.messageGameRoom({ type: "RESET_TIMER" })
        this.messageGameRoom({ type: "START_NEXT_TURN" })
        this.listenForNextMove()
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
}

module.exports = GameRoom
