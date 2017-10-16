import { createActions, handleActions } from "redux-actions"
import { combineReducers } from "redux"

const {
     fetchLeaderboardData,
     fetchLeaderboardDataSuccess,
     fetchLeaderboardDataError
} = createActions(
    "FETCH_LEADERBOARD_DATA",
    "FETCH_LEADERBOARD_DATA_SUCCESS",
    "FETCH_LEADERBOARD_DATA_ERROR"
)

export const actions = {
    fetchLeaderboardData,
    fetchLeaderboardDataSuccess,
    fetchLeaderboardDataError
}

const leaderboardReducer = handleActions({
    [fetchLeaderboardData]: (state, action) => ({ ...state, isLoading: true }),
    [fetchLeaderboardDataSuccess]: (state, action) => ({
        ...state,
        isLoading: false,
        players: action.payload
    }),
    [fetchLeaderboardDataError]: (state, action) => ({
        ...state,
        isLoading: false,
        error: action.payload
    })
}, { isLoading: true, players: [] })

export default combineReducers({ leaderboards: leaderboardReducer })
