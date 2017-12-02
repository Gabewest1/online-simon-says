export const getUser = state => state.authorization.info
export const getUsername = state => getUser(state).username
export const getHighScore = state => getUser(state).statsByGameMode[1].highScore
export const getRanking = state => state.authorization.ranking
export const isLoading = state => state.authorization.isLoading
