import { call, put, takeEvery } from "redux-saga/effects"
import { delay } from "redux-saga"
import { actions } from "./reducer"

const root = function* () {
    yield [
        watchLogin(),
        watchPlayAsGuest()
    ]
}

export const watchLogin = function* () {
    console.log("Watching login")
    yield takeEvery(actions.login, login)
}

export const watchPlayAsGuest = function* () {
    yield takeEvery(actions.playAsGuest, playAsGuest)
}

export const login = function* (action) {
    console.log("Entered the login function", action)
    yield delay(2000)
}

export const playAsGuest = function* () {
    const guest = {
        username: `Guest${Math.floor(Math.random() * 1000000)}`,
        xp: 0
    }

    yield put({ type: "server/PLAY_AS_GUEST", payload: guest })
    yield put(actions.loginSuccess({ token: null, user: guest }))
} 

export default root
