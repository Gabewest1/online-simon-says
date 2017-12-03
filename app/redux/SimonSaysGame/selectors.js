import { selectors as userSelectors } from "../Auth"

export const getMoves = state => state.simonSays.moves
export const getPlayers = state => state.simonSays.players
export const getPads = state => state.simonSays.pads
export const getWinner = state => state.simonSays.game.winner
export const getGameMode = state => state.simonSays.game.gameMode
export const selectPerformingPlayer = state => {
    let player = state.simonSays.game.performingPlayer

    if (!player) {
        player = getPlayers(state)[0]
    }

    if (!player) {
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
export const isGameOver = state => state.simonSays.game.isGameOver
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
    !isItMyTurn(state) || isScreenDarkened(state) || (numberOfMoves(state) > 0 && getMoveIndex(state) >= numberOfMoves(state))
export const getAnimatingPadIndex = state => state.simonSays.pads.lit

const colors = ["", "Blue", "Red", "Green", "Yellow"]
export const getWrongMove = state => colors[state.simonSays.gameInformation.wrongMove]
export const getCorrectMove = state => colors[state.simonSays.gameInformation.correctMove]
