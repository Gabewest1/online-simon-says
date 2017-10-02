import { selectors as userSelectors } from "../Auth"

export const getMoves = state => state.simonSays.moves
export const getPlayers = state => state.simonSays.players
export const getPads = state => state.simonSays.pads
export const selectPerformingPlayer = state => {
    //performing player only gets set when the player is playing an
    //online game. If there isn't a player then we know we're playing a
    //single player game and should grab the players own user object.
    let player = state.simonSays.game.performingPlayer
    if (!player) {
        player = userSelectors.getUser(state)
    }

    return player
}
export const isItMyTurn = state => userSelectors.getUsername(state) === selectPerformingPlayer(state).username
export const isGameOver = state => state.simonSays.game.isGameOver
export const getCurrentRound = state => state.simonSays.game.round
export const hasFoundMatch = state => state.simonSays.game.hasFoundMatch
export const isScreenDarkened = state => state.simonSays.game.isScreenDarkened
export const getTimer = state => state.simonSays.game.timer
