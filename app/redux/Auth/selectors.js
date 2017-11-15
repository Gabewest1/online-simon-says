export const getUsername = state => state.authorization.info.username
export const getUser = state => state.authorization.info
export const getHighScore = state => getUser(state).statsByGameMode[1].highScore
export const getRanking = state => state.authorization.ranking
