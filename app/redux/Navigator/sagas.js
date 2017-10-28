import { Platform } from "react-native"
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

    //Lightbox doesn't work properly on ios
    //Modal doesn't work properly on android
    const showModalOrLightbox = Platform.select({
        ios: ReactNativeNavigator.showModal,
        android: ReactNativeNavigator.showLightBox
    })

    const dismissModalOrLightbox = Platform.select({
        ios: ReactNativeNavigator.dismissModal,
        android: ReactNativeNavigator.dismissLightBox
    })

    showModalOrLightbox({
        screen: "QuitModal",
        passProps: { stay: stay.onPress, exit: exit.onPress },
        style: {
            backgroundBlur: "dark",
            backgroundColor: "#00000060"
        }
    })

    const { playerStayed, playerLeft } = yield race({
        playerStayed: take(stay.type),
        playerLeft: take(exit.type)
    })

    dismissModalOrLightbox()

    if (playerLeft) {
        ReactNativeNavigator.resetTo({
            screen: "SelectGameMode"
        })
    }
}


export default root
