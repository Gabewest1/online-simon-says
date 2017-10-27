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

    ReactNativeNavigator.showModal({
        screen: "QuitModal",
        passProps: { stay: stay.onPress, exit: exit.onPress },
        style: {
            backgroundBlur: "dark",
            backgroundColor: "#0000060"
        }
    })

    const { playerStayed, playerLeft } = yield race({
        playerStayed: take(stay.type),
        playerLeft: take(exit.type)
    })

    ReactNativeNavigator.dismissModal()

    if (playerLeft) {
        ReactNativeNavigator.resetTo({
            screen: "SelectGameMode"
        })
    }
}


export default root
