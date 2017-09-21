export const getMoves = state => state.simonSays.moves
export const getPlayers = state => state.simonSays.players
export const getPads = state => state.simonSays.pads
export const selectPerformingPlayer = state => state.simonSays.players[0]
export const isGameOver = state => state.simonSays.game.isGameOver
export const getCurrentRound = state => state.simonSays.game.round