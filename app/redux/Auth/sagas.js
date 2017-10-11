import { call, put, race, take, takeEvery } from "redux-saga/effects"
import { delay } from "redux-saga"
import { actions } from "./reducer"

let NavigatorActions

const root = function* () {
    yield [
        getNavigatorActions(),
        handleSuccessfulSignIn(),
        watchLogin(),
        watchLogout(),
        watchPlayAsGuest(),
        watchRegister()
    ]
}

export const getNavigatorActions = function* () {
    let action = yield take(actions.giveSagasNavigator)
    NavigatorActions = action.payload
}
export const watchLogin = function* () {
    yield takeEvery(actions.login, login)
}
export const watchLogout = function* () {
    yield takeEvery(actions.logout, logout)
}
export const watchPlayAsGuest = function* () {
    yield takeEvery(actions.playAsGuest, playAsGuest)
}
export const watchRegister = function* () {
    yield takeEvery(actions.register, register)
}


export const login = function* (action) {
    const credentials = action.payload

    yield put({ type: "server/LOGIN", payload: credentials })
}

export const register = function* (action) {
    console.log("Entered the register function", action)
    yield put({ type: "server/REGISTER", payload: action.payload })
}

export const playAsGuest = function* () {
    const guest = {
        username: `Guest${Math.floor(Math.random() * 1000000)}`,
        xp: 0
    }

    yield put({ type: "server/PLAY_AS_GUEST", payload: guest })
    yield put(actions.loginSuccess({ token: null, user: guest }))
}

export const logout = function* () {
    yield put({ type: "server/LOGOUT" })
}

export const handleSuccessfulSignIn = function* () {
    console.log("WAITING FOR A LOGIN SUCCESS")
    while (yield take(actions.loginSuccess)) {
        console.log("USER LOGGED IN AND IM ABOUT TO NAVIGATE!")

        NavigatorActions.push({
            screen: "SelectGameMode",
            title: "Play",
            animated: true,
            animationType: "slide-horizontal",
            backButtonHidden: true
        })
    }
}

export default root
