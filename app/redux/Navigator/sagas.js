import {  race, take, takeLatest } from "redux-saga/effects"
import { actions } from "./reducer"

let ReactNativeNavigator

const root = function* () {
    yield [
        getNavigatorSaga(),
        watchShowExitMessage()
    ]
}

export const getNavigatorSaga = function* () {
    let action = yield take(actions.giveSagasNavigator)
    ReactNativeNavigator = action.payload
}

export const watchShowExitMessage = function* () {
    yield takeLatest(actions.showBackoutWarningMessage, showExitMessageSaga)
}

export const showExitMessageSaga = function* () {
    ReactNativeNavigator.showLightBox({
        screen: "QuitModal",
        passProps: {},
        style: {
            backgroundBlur: "dark",
            backgroundColor: "#00000080"
        }
    })

    const { stay, exit } = yield race({
        stay: take(actions.stay),
        exit: take(actions.exit)
    })

    ReactNativeNavigator.dismissLightBox()

    if (exit) {
        ReactNativeNavigator.resetTo({
            screen: "SelectGameMode"
        })
    }
}


export default root
