import { put, takeLatest } from "redux-saga/effects"
import { actions } from "./reducer"

const root = function* () {
    yield [
        watchLeaderboardsQuery()
    ]
}

export const watchLeaderboardsQuery = function* () {
    yield takeLatest(actions.fetchLeaderboardData, fetchLeaderboardData)
}

export const fetchLeaderboardData = function* (action) {
    yield put({ type: `server/${actions.fetchLeaderboardData}`, payload: action.payload })
}

export default root
