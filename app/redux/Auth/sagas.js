import { call, put, takeEvery } from "redux-saga/effects"
import { delay } from "redux-saga"
import { actions } from "./reducer"

const root = function* () {
    yield [
        watchLogin()
    ]
}

export const watchLogin = function* () {
    console.log("Watching login")
    yield takeEvery(actions.login, login)
}

export const login = function* (action) {
    console.log("Entered the login function", action)
    yield delay(2000)
}

export default root
