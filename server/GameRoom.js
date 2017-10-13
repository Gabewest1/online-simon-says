const { actions: simonActions } = require("../app/redux/SimonSaysGame")
const SimonGame = require("./SimonGame")

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
        this.simonGame = new SimonGame()
        this.timer
        this.performingPlayer
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
    addNextMove(move) {
        this.movesToPerform.push(move)
        this.messageGameRoom({ type: "ADD_NEXT_MOVE", payload: move })
    }
    addPlayer(player) {
        this.players.push(player)
    }
    removePlayer(playerToRemove) {
        this.players = this.players.filter(player => player !== playerToRemove)
    }
    eliminatePlayer(playerToEliminate) {
        console.log("ELIMNATING PLAYER:", playerToEliminate)
        this.players.find(player => player === playerToEliminate).player.isEliminated = true
        this.eliminatedPlayers.push(playerToEliminate)
        
        this.messageGameRoom({ type: "ELIMINATE_PLAYER", payload: playerToEliminate.player})
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
    isGameRoomReady() {
        return this.players.length === this.playersNeededToStart
    }
    listenForNextMove() {
        if (this.currentMovesIndex === 0) {
            this.timer = this.startLongTimer()
        } else {
            this.timer = this.startShortTimer()
        }
    }
    setNextPlayer() {
        let indexOfCurrentPlayer = this.players.indexOf(this.performingPlayer)
        let counter = 1
        let nextPlayerToPerform

        while (!nextPlayerToPerform) {
            nextPlayerToPerform = this.players[(indexOfCurrentPlayer + counter) % this.players.length]
            counter++
        }

        this.performingPlayer = nextPlayerToPerform
        this.messageGameRoom({ type: "SET_PERFORMING_PLAYER", payload: this.performingPlayer.player })
    }
    isGameOver() {
        const numPlayersLeft = this.players.map(({ player }) => !player.isEliminated).length

        if (numPlayersLeft === 1) {
            return true
        } else {
            return false
        }
    }
    handleSimonMove(playersMove) {
        if (this.currentMovesIndex === this.movesToPerform) {
            const pad = { pad: playersMove, isValid: true }       
            this.messageGameRoom({ type: "ANIMATE_SIMON_PAD_ONLINE", payload: pad })
            this.addNextMove(playersMove)        
            this.messageGameRoom({ type: "PLAYER_FINISHED_TURN" })
            clearInterval(this.timer)
            this.timer = undefined

            return
        }

        const isValidMove = playersMove === this.movesToPerform[this.currentMovesIndex]
        const pad = { pad: playersMove, isValid: isValidMove }
        this.messageGameRoom({ type: "ANIMATE_SIMON_PAD_ONLINE", payload: pad })

        if (!isValidMove) {
            this.eliminatePlayer(this.performingPlayer)
        }

        clearInterval(this.timer)
        this.timer = undefined

        this.currentMovesIndex++

        this.listenForNextMove()
    }
    playerTimedOut() {
        clearInterval(this.timer)
        this.timer = undefined
        this.eliminatePlayer(this.performingPlayer)
    }
    startLongTimer() {
        let timeTillPlayerTimesout = 15

        return setInterval(() => {
            this.messageGameRoom(simonActions.decreaseTimer())
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
