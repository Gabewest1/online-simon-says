const SimonGame = require("./SimonGame")

class GameRoom {
    constructor(id, gameMode) {
        this.id = id
        this.gameMode = gameMode
        this.game = new SimonGame()
        this.playersNeededToStart = gameMode
        this.lobby = []
        this.playersReceivingMessages = []
        this.playersReady = []
        this.playersReadyForNextTurn = []
        this.acceptPlayersReadyForNextTurn = false
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
        this.game.addPlayer(playerSocket.player)
        this.playersReceivingMessages.push(playerSocket)

        playerSocket.gameRoom = { id: this.id, gameMode: this.gameMode }

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
        this.playersReadyForNextTurn = []
        this.acceptPlayersReadyForNextTurn = false

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
            this.waitForPlayersToReadyUp()
        } else if (this.currentMovesIndex === this.movesToPerform.length) {
            this.addNextMove(playersMove.pad)
            this.waitForPlayersToReadyUp()
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

        if (this.currentMovesIndex === 0) {
            this.timer = this.startLongTimer()
        } else {
            this.timer = this.startShortTimer()
        }
    }
    messageGameRoom(action, filterPlayers) {
        if (filterPlayers) {
            this.playersReceivingMessages
                .filter(filterPlayers)
                .forEach(player => player.emit("action", action))
        } else {
            this.playersReceivingMessages.forEach(player => {
                player.emit("action", action)
            })
        }
    }
    playerLeft(playerSocket) {
        this.playersReceivingMessages = this.playersReceivingMessages.filter(player => player !== playerSocket)
        playerSocket.gameRoom = undefined

        if (!this.gameStarted) {
            this.game.removePlayer(playerSocket.player)
            this.lobby = this.lobby.filter(player => player !== playerSocket)
        }
    }
    playerLostConnection(playerSocket) {
        this.playerLeft(playerSocket)
        const isPlayerAlreadyEliminated = this.eliminatedPlayers.find(({ player }) => player === playerSocket)

        if (!isPlayerAlreadyEliminated && !this.isGameOver()) {
            this.eliminatePlayer(playerSocket)
            this.messageGameRoom({ type: "PLAYER_DISCONNECTED", payload: playerSocket.player })
        }
    }
    playerReadyForNextTurn(playerSocket) {
        const isPlayerAlreadyReady = this.playersReadyForNextTurn.indexOf(playerSocket) >= 0

        if (this.acceptPlayersReadyForNextTurn && !isPlayerAlreadyReady) {
            this.playersReadyForNextTurn.push(playerSocket)

            //Check if this is the last player to ready up and end turn if so.
            if (this.playersReadyForNextTurn.length === this.playersReceivingMessages.length) {
                this.timer = clearTimeout(this.timer)
                this.endTurn()
            }
        }
    }
    playerReadyToStart(playerSocket) {
        if (this.playersReadyToStart.indexOf(playerSocket) === -1) {
            this.playersReadyToStart.push(playerSocket)

            if (this.playersReadyToStart.length === this.playersReceivingMessages.length) {
                this.timer = clearTimeout(this.timer)
                this.playersReadyToStart = []
                this.startFirstTurn()
            }
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
        let indexOfCurrentPlayer = this.game.players.findIndex(player => player.username === this.performingPlayer.player.username)
        let counter = 1
        let nextPlayerToPerform = this.game.players[(indexOfCurrentPlayer + counter) % this.game.players.length]

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
        this.messageGameRoom(
            { type: "LISTEN_FOR_OPPONENTS_MOVES" },
            (playerSocket) => playerSocket.player.username !== this.performingPlayer.player.username
        )
        this.listenForNextMove()
        this.performingPlayer.emit("action", { type: "PERFORM_YOUR_TURN" })
    }
    startNextTurn() {
        this.currentMovesIndex = 0
        this.increaseRound()
        this.messageGameRoom({ type: "RESET_TIMER" })
        this.listenForNextMove()
        this.messageGameRoom({ type: "SET_PERFORMING_PLAYER", payload: this.performingPlayer.player })
        this.messageGameRoom({ type: "START_NEXT_TURN" })
        this.messageGameRoom(
            { type: "LISTEN_FOR_OPPONENTS_MOVES" },
            (playerSocket) => playerSocket.player.username !== this.performingPlayer.player.username
        )
        this.performingPlayer.emit("action", { type: "PERFORM_YOUR_TURN" })
    }
    startJoinMatchTimer() {
        const timeTillPlayerTimesout = 18000
        const notReady = ({ player }) =>
            !this.playersReadyToStart.find(socket => socket.player.username === player.username)

        return setTimeout(() => {
            this.timer = undefined
            const playersNotReady = this.lobby.filter(notReady)
            console.log("PLAYERS NOT READY:".yellow, playersNotReady.length)
            playersNotReady.forEach(player => {
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

        //I have a bug where, if a player quits a match and finds a new one really quick, the DECREASE_TIMER
        //call from the previous game affect the player in their new game.
        const inThisLobby = (playersSocket) => playersSocket.gameRoom && playersSocket.gameRoom.id === this.id

        const timer = setInterval(() => {
            this.messageGameRoom({ type: "DECREASE_TIMER" }, inThisLobby)
            timeTillPlayerTimesout--

            if (timeTillPlayerTimesout === 0) {
                this.playerTimedOut()
                clearInterval(timer)
            }
        }, 1000)

        return timer
    }
    startShortTimer() {
        let timeTillPlayerTimesout = 7

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
        this.messageGameRoom({ type: "SET_PLAYERS", payload: this.game.players })
    }
    updatePlayersStats(player) {
        //Update players stats as long as they arent a guest
        if (!player.player.isAGuest) {
            console.log("ABOUT TO UPDATE:", player.player.username)
            const gameMode = this.lobby.length
            const didPlayerWin = this.winner && (this.winner.player.username === player.player.username)

            let numPlayersBeaten = this.eliminatedPlayers.length
            numPlayersBeaten -= didPlayerWin ? 0 : 1

            let xpGained = (numPlayersBeaten * 10) + this.round
            xpGained += didPlayerWin ? ((gameMode * 5) + 10) : 0

            player.emit("action", { type: "server/UPDATE_MULITPLAYER_STATS", payload: { didPlayerWin, gameMode, xpGained } })
        }
    }
    waitForPlayersToReadyUp() {
        this.acceptPlayersReadyForNextTurn = true
        this.timer = setTimeout(() => {
            this.endTurn()
        }, 15000)
    }
}

module.exports = GameRoom
