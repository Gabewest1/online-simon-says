import { selectors as userSelectors } from "../Auth"

export const getMoves = state => state.simonSays.moves
export const getPlayers = state => state.simonSays.players
export const getPads = state => state.simonSays.pads
export const selectPerformingPlayer = state => state.simonSays.game.performingPlayer
export const isItMyTurn = state => userSelectors.getUsername(state) === selectPerformingPlayer(state).username
export const isGameOver = state => state.simonSays.game.isGameOver
export const getCurrentRound = state => state.simonSays.game.round
export const hasFoundMatch = state => state.simonSays.game.hasFoundMatch
export const isScreenDarkened = state => state.simonSays.game.isScreenDarkened
export const getTimer = state => state.simonSays.game.timer
