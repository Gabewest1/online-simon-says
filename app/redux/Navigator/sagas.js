import { put, race, take, takeLatest } from "redux-saga/effects"
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

export const showExitMessageSaga = function* (action) {
    const { stay, exit } = action.payload

    ReactNativeNavigator.showLightBox({
        screen: "QuitModal",
        passProps: { stay: stay.onPress, exit: exit.onPress },
        style: {
            backgroundBlur: "dark",
            backgroundColor: "#00000080"
        }
    })

    const { playerStayed, playerLeft } = yield race({
        playerStayed: take(stay.type),
        playerLeft: take(exit.type)
    })

    ReactNativeNavigator.dismissLightBox()

    if (playerLeft) {
        ReactNativeNavigator.resetTo({
            screen: "SelectGameMode"
        })
    }
}


export default root
