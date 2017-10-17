import { put, takeLatest } from "redux-saga/effects"
import { actions } from "./reducer"

const root = function* () {
    yield [
        watchLeaderboardsQuery()
    ]
}

export const watchLeaderboardsQuery = function* () {
    console.log("AYYY WATCHIN GSHITHK")
    yield takeLatest(actions.fetchLeaderboardData, fetchLeaderboardData)
}

export const fetchLeaderboardData = function* (action) {
    console.log("AYYYYYYYY")
    yield put({ type: "server/FETCH_LEADERBOARD_DATA", payload: action.payload })
}

export default root
