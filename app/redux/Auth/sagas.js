import { call, fork, put, select, take, takeEvery } from "redux-saga/effects"
import { AsyncStorage } from "react-native"
import { actions, selectors } from "./index"
import { actions as navigatorActions } from "../Navigator"

const root = function* () {
    yield [
        handleSuccessfulSignIn(),
        watchLogin(),
        watchLogout(),
        watchPlayAsGuest(),
        watchRegister()
    ]
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
    let credentials = { ...action.payload }

    Object.keys(credentials).map(key => {
        credentials[key] = credentials[key].toLowerCase()
    })

    yield put(actions.setPassword(credentials.password))

    yield put({ type: "server/LOGIN", payload: credentials })
}

export const register = function* (action) {
    let credentials = { ...action.payload }

    Object.keys(credentials).map(key => {
        credentials[key] = credentials[key].toLowerCase()
    })

    yield put(actions.setPassword(credentials.password))

    yield put({ type: "server/REGISTER", payload: credentials })
}

export const playAsGuest = function* () {
    const guest = {
        username: `Guest${Math.floor(Math.random() * 1000000)}`,
        xp: 0,
        level: 1,
        isAGuest: true,
        statsByGameMode: { 1: { highScore: 0 } }
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
        yield fork(rememberUser)

        const navigationOptions = {
            screen: "SelectGameMode",
            animated: true,
            animationType: "slide-horizontal",
            backButtonHidden: true
        }

        const payload = { fn: "resetTo", navigationOptions }

        yield put(navigatorActions.navigateToScreen(payload))
    }
}

export const rememberUser = function* () {
    try {
        const isAGuest = yield select(selectors.isAGuest)

        if (!isAGuest) {
            const username = yield select(selectors.getUsername)
            const password = yield select(selectors.getPassword)
            console.log("Saving the user", username, password)
            
            yield call(AsyncStorage.setItem, "username", username)
            yield call(AsyncStorage.setItem, "password", password)
        }
    } catch (e) {
        console.log(e)
    }
}

export default root
