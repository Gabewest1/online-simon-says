import { selectors as userSelectors } from "../Auth"

export const getMoves = state => state.simonSays.moves
export const getPlayers = state => state.simonSays.players
export const getPads = state => state.simonSays.pads
export const getWinner = state => state.simonSays.game.winner
export const getGameMode = state => state.simonSays.game.gameMode
export const selectPerformingPlayer = state => {
    let player = state.simonSays.game.performingPlayer
    let gameMode = getGameMode(state)

    if (gameMode > 1) {
        if (!player) {
            //Multiplayer games need to initiate with a performingPlayer prop BUT my server
            //doesn't set that variable until after the <SimonGameScreen/> renders.
            //
            //Need to set the player to a mock player so an error doesn't occur.
            player = { username: "zxddwfzafqwfa", level: "999" }
        }
    } else {
        player = userSelectors.getUser(state)
    }

    return player
}
export const isItMyTurn = state => {
    let performingPlayer = selectPerformingPlayer(state)

    if (performingPlayer && userSelectors.getUsername(state) === performingPlayer.username) {
        return true
    } else {
        return false
    }
}
export const isLastMove = state => {
    return getMoveIndex(state) === numberOfMoves(state) - 1
}
export const playerFinishedTurn = state => {
    const gameMode = getGameMode(state)
    const movesPerformed = getMoveIndex(state)
    const numMoves = numberOfMoves(state)

    return numMoves > 0 && movesPerformed >= numMoves
}
export const isGameOver = state => state.simonSays.game.isGameOver
export const isWaitingForOpponents = state => isItMyTurn(state) && isScreenDarkened(state)
export const getCurrentRound = state => state.simonSays.game.round
export const hasFoundMatch = state => state.simonSays.game.hasFoundMatch
export const isScreenDarkened = state => state.simonSays.game.isScreenDarkened || !isItMyTurn(state)
export const getTimer = state => state.simonSays.game.timer
export const hasGameStarted = state => getMoves(state).length > 0
export const numberOfMoves = state => {
    //if the game is multiplayer than the number of moves should be increased by 1
    //b/c the performing player adds 1 additional move to the movesArray during their turn.
    const includeOneExtraMove = getGameMode(state) > 1
    const bonus = includeOneExtraMove ? 1 : 0

    return getMoves(state).length + bonus
}
export const getMoveIndex = state => state.simonSays.game.moveIndex
export const disableOnPress = state =>
    !isItMyTurn(state) || isScreenDarkened(state) || playerFinishedTurn(state)
export const getAnimatingPadIndex = state => state.simonSays.pads.lit

const colors = ["", "Blue", "Red", "Green", "Yellow"]
export const getWrongMove = state => colors[state.simonSays.gameInformation.wrongMove]
export const getCorrectMove = state => colors[state.simonSays.gameInformation.correctMove]
