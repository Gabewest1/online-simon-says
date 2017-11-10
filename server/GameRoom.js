const SimonGame = require("./SimonGame")

class GameRoom {
    constructor(id, gameMode) {
        this.id = id
        this.gameMode = gameMode
        this.game = new SimonGame()
        this.playersNeededToStart = gameMode
        this.lobby = []
        this.playersReady = []
        this.playersReadyToStart = []
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
    addPlayer(playerSocket) {
        /*** Important to remeber!!! This is where i assign the clients property info about their current game room ***/
        this.lobby.push(playerSocket)

        playerSocket.gameRoom = { id: this.id, gameMode: this.gameMode }

        this.syncPlayersArrayWithRedux()
        playerSocket.emit("action", { type: "SET_GAME_MODE", payload: this.gameMode })
    }
    eliminatePlayer(playerToEliminate) {
        const player = this.game.players.find(player => player.username === playerToEliminate.player.username)
        const theGameIsNotOver = !this.isGameOver()
        const thePlayerHasntBeenEliminatedYet = !player.isEliminated

        console.log("ELIMNATING PLAYER:", player.username)

        if (theGameIsNotOver && thePlayerHasntBeenEliminatedYet) {
            player.isEliminated = true
            this.eliminatedPlayers.push({ player: playerToEliminate, rounds: this.round })
            this.messageGameRoom({ type: "ELIMINATE_PLAYER", payload: player})
            this.updatePlayersStats(playerToEliminate)
        }
    }
    endTurn() {
        this.timer = clearInterval(this.timer)

        if (this.isGameOver()) {
            this.endGame()
        } else {
            this.setNextPlayer()
            this.startNextTurn()
        }
    }
    endGame() {
        this.timer = clearInterval(this.timer)
        const winner = this.game.players.find(player => !player.isEliminated)
        this.winner = this.lobby.find(socket => socket.player.username === winner.username)
        console.log("ENDING GAME:", this.winner.player.username + " Won!".cyan)
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
            this.endTurn()
        } else if (this.currentMovesIndex === this.movesToPerform.length) {
            this.addNextMove(playersMove.pad)
            setTimeout(() => this.endTurn(), 1)
        } else {
            this.currentMovesIndex++

            this.listenForNextMove()
        }
    }
    isGameRoomReady() {
        return this.lobby.length === this.playersNeededToStart
    }
    increaseRound() {
        this.round++
        this.messageGameRoom({ type: "INCREASE_ROUND_COUNTER" })
    }
    isGameOver() {
        const numPlayersLeft = this.game.players.filter(player => !player.isEliminated).length
        console.log("NUMBER OF PLAYERS LEFT:", numPlayersLeft)
        if (numPlayersLeft <= 1) {
            return true
        } else {
            return false
        }
    }
    listenForNextMove() {
        const isTimerAlreadySet = this.timer

        if (isTimerAlreadySet) {
            return
        }

        console.log("STARTING THE TIMER AND LISTENING FOR THE NEXT MOVE".magenta, this.timer)

        if (this.currentMovesIndex === 0) {
            this.timer = this.startLongTimer()
        } else {
            this.timer = this.startShortTimer()
        }
    }
    messageGameRoom(action, filterPlayers) {
        if (filterPlayers) {
            this.lobby
                .filter(filterPlayers)
                .forEach(player => player.emit("action", action))
        } else {
            this.lobby.forEach(player => {
                player.emit("action", action)
            })
        }
    }
    playerLostConnection(thisPlayer) {
        const isPlayerAlreadyEliminated = this.eliminatedPlayers.find(({ player }) => player === thisPlayer)
        console.log("IS PLAYER ALREADY ELIMINATED:", isPlayerAlreadyEliminated)
        if (!this.isGameOver() && !isPlayerAlreadyEliminated) {
            this.eliminatePlayer(thisPlayer)
            this.removePlayer(thisPlayer)
            this.messageGameRoom({ type: "PLAYER_DISCONNECTED", payload: thisPlayer.player })
        }
    }
    playerTimedOut() {
        console.log("Player timed out:", this.performingPlayer.player.username)
        this.timer = clearInterval(this.timer)
        this.messageGameRoom({ type: "PLAYER_TIMEDOUT" })
        this.eliminatePlayer(this.performingPlayer)
        this.endTurn()
    }
    playerReadyToStart(player) {
        if (this.playersReadyToStart.indexOf(player) === -1) {
            this.playersReadyToStart.push(player)

            if (this.playersReadyToStart.length === this.lobby.length) {
                this.timer = clearTimeout(this.timer)
                this.playersReadyToStart = []
                this.startFirstTurn()
            }
        }
    }
    removePlayer(playerToRemove) {
        this.lobby = this.lobby.filter(player => player !== playerToRemove)
        playerToRemove.gameRoom = undefined
    }
    setNextPlayer() {
        let indexOfCurrentPlayer = this.game.players.findIndex(player => player.username === this.performingPlayer.player.username)
        let counter = 1
        let nextPlayerToPerform = this.game.players[(indexOfCurrentPlayer + counter) % this.game.players.length]
        console.log("About to set the next player...", this.game.players.filter(player => !player.isEliminated).length)
        while (nextPlayerToPerform.isEliminated) {
            counter++
            nextPlayerToPerform = this.game.players[(indexOfCurrentPlayer + counter) % this.game.players.length]
        }

        this.performingPlayer = this.lobby.find(({ player }) => player.username === nextPlayerToPerform.username)
        console.log("NEXT PLAYER TO PERFORM: ", nextPlayerToPerform.username)
    }
    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true
            this.performingPlayer = this.lobby[0]    
            this.messageGameRoom({ type: "FOUND_MATCH" })
            this.timer = this.startJoinMatchTimer()
        }
    }
    startFirstTurn() {
        this.messageGameRoom({ type: "SET_PERFORMING_PLAYER", payload: this.performingPlayer.player })
        this.listenForNextMove()
        this.performingPlayer.emit("action", { type: "PERFORM_YOUR_TURN" })
    }
    startNextTurn() {
        console.log("STARTING NEXT PLAYERS TURN:", this.performingPlayer.player.username)
        this.currentMovesIndex = 0
        this.increaseRound()
        this.messageGameRoom({ type: "RESET_TIMER" })
        this.listenForNextMove()
        this.messageGameRoom({ type: "SET_PERFORMING_PLAYER", payload: this.performingPlayer.player })
        this.performingPlayer.emit("action", { type: "PERFORM_YOUR_TURN" })
    }
    startJoinMatchTimer() {
        const timeTillPlayerTimesout = 5000
        const notReady = ({ player }) =>
            !this.playersReadyToStart.find(socket => socket.player.username === player.username)

        console.log("STARTING JOIN MATCH TIMER".green)
        return setTimeout(() => {
            this.timer = undefined
            const playersNotReady = this.lobby.filter(notReady)
            console.log("PLAYERS NOT READY:".yellow, playersNotReady.length)
            playersNotReady.forEach((player) => {
                this.playerLostConnection(player)

                player.emit("action", { type: "KICK_INACTIVE_PLAYER" })
            })
            
            if (this.isGameOver()) {
                this.endGame()
            } else {
                this.startFirstTurn()
            }

        }, timeTillPlayerTimesout) 
    }
    startLongTimer() {
        let timeTillPlayerTimesout = 15

        const timer = setInterval(() => {
            this.messageGameRoom({ type: "DECREASE_TIMER" })
            timeTillPlayerTimesout--

            if (timeTillPlayerTimesout === 0) {
                this.playerTimedOut()
                clearInterval(timer)
            }
        }, 1000)

        return timer
    }
    startShortTimer() {
        let timeTillPlayerTimesout = 3

        const timer = setInterval(() => {
            timeTillPlayerTimesout--

            if (timeTillPlayerTimesout === 0) {
                this.playerTimedOut()
                clearInterval(timer)
            }
        }, 1000)

        return timer
    }
    syncPlayersArrayWithRedux() {
        this.game.players = this.lobby.map(socket => {
            const player = this.game.players.find(player => player.username === socket.player.username)
            console.log("LOOKING FOR PLAYER TO SYNC:", player && player.username)
            const playerFromSocket = socket.player.isAGuest ? socket.player : socket.player._doc

            return Object.assign(
                {},
                playerFromSocket,
                { isEliminated: false },
                { isReady: player ? player.isReady : false }
            )
        })

        this.messageGameRoom({ type: "SET_PLAYERS", payload: this.game.players })
    }
    updatePlayersStats(player) {
        //Update players stats as long as they arent a guest
        if (!player.player.isAGuest) {
            console.log("ABOUT TO UPDATE:", player.player.username)
            const gameMode = this.gameMode
            const didPlayerWin = this.winner && (this.winner.player.username === player.player.username)

            let numPlayersBeaten = this.eliminatedPlayers.length
            numPlayersBeaten -= didPlayerWin ? 0 : 1

            let xpGained = (numPlayersBeaten * 10) + this.round
            xpGained += didPlayerWin ? ((this.gameMode * 5) + 10) : 0

            player.emit("action", { type: "server/UPDATE_MULITPLAYER_STATS", payload: { didPlayerWin, gameMode, xpGained } })
        }
    }
}

module.exports = GameRoom
