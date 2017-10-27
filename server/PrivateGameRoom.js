const GameRoom = require("./GameRoom")

class PrivateGameRoom extends GameRoom {
    constructor(id, gameMode) {
        super(id, gameMode)
    }
    animateSimonPad(pad) {
        super.animateSimonPad(pad)
    }
    addNextMove(move) {
        super.addNextMove(move)
    }
    addPlayer(player) {
        super.addPlayer(player)
    }
    eliminatePlayer(playerToEliminate) {
        super.eliminatePlayer(playerToEliminate)
    }
    endTurn() {
        super.endTurn()
    }
    endGame() {
        super.endGame()
    }
    handleSimonMove(playersMove) {
        super.handleSimonMove(playersMove)
    }
    isGameRoomReady() {
        super.isGameRoomReady()
    }
    increaseRound() {
        super.increaseRound()
    }
    isGameOver() {
        super.isGameOver()
    }
    listenForNextMove() {
        super.listenForNextMove()
    }
    messageGameRoom(action, filterPlayers) {
        super.messageGameRoom(action, filterPlayers)
    }
    playerLostConnection(thisPlayer) {
        super.playerLostConnection(thisPlayer)
    }
    playerTimedOut() {
        super.playerTimedOut()
    }
    playerReady(player) {
        super.playerReady(player)
    }
    playerNotReady(player) {
        super.playerNotReady(player)
    }
    playerReadyToStart(player) {
        super.playerReadyToStart(player)
    }
    removePlayer(playerToRemove) {
        super.removePlayer(playerToRemove)
    }
    setNextPlayer() {
        super.setNextPlayer()
    }
    startGame() {
        super.startGame()
    }
    startFirstTurn() {
        super.startFirstTurn()
    }
    startNextTurn() {
        super.startNextTurn()
    }
    startLongTimer() {
        super.startLongTimer()
    }
    startShortTimer() {
        super.startShortTimer()
    }
    syncPlayersArrayWithRedux() {
        super.syncPlayersArrayWithRedux()
    }
    updatePlayersStats(player) {
        super.updatePlayersStats(player)
    }
}

module.exports = PrivateGameRoom
