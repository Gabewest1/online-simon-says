import { AppState, Platform } from "react-native"
import { call, put, race, take, takeLatest } from "redux-saga/effects"
import { actions } from "./reducer"

/*** 
 * I couldn't find a way to import the navigator object from react-native-navigation
 * so i could change screens from within the sagas.
 * 
 * Instead, i had the <StartingScreen/> dispatch an action with the navigator object
 * as a payload, which i assign to ReactNativeNavigator variable below.
 ***/

let ReactNativeNavigator

const root = function* () {
    yield [
        getNavigatorSaga(),
        watchShowExitMessage(),
        watchPlayerDisconnected()
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

export const watchPlayerDisconnected = function* () {
    yield take("PLAYER_DISCONNECTED")
    console.log("I GOT THE ACTION IN PLAYER DISCONNECTED SAGA")
    
    yield call(navigateScreens, "resetTo", { screen: "StartingScreen" })
}

export const navigateScreens = function* (fn, options) {
    if (AppState.currentState !== "active") {
        console.log("WAITING FOR THE APP TO GO ACTIVE")
        yield take("APP_ACTIVE")
    }

    ReactNativeNavigator[fn](options)
    console.log("END OF navigateScreens* ()")     
}

export default root
