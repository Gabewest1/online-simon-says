import { AppState, Platform } from "react-native"
import { call, put, race, take, takeLatest } from "redux-saga/effects"
import { actions } from "./reducer"
import { actions as simonGameActions } from "../SimonSaysGame"
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
        watchNavigateScreens(),
        watchShowInAppNotification(),
        watchSocketDisconnected(),
        watchShowExitMessage(),
        kickInactivePlayerSaga()
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

export const watchShowInAppNotification = function* () {
    yield takeLatest(actions.showInAppNotification, showInAppNotificationSaga)
}
export const showInAppNotificationSaga = function* () {
    const { fn, navigationOptions } = action.payload
    
    if (AppState.currentState !== "active") {
        yield take("APP_ACTIVE")
    }

    ReactNativeNavigator[fn](navigationOptions)
}
export const showInactivityMessageSaga = function* () {
    const payload = {
        fn: "showInAppNotification",
        navigationOptions: {
            screen: "InactivePlayerNotification",
            autoDismissTimerSec: 7,
            position: "bottom"
        }
    }

    yield put(actions.showInAppNotification(payload))
}
export const showLostInternetConnectionNotificationSaga = function* () {
    const payload = {
        fn: "showInAppNotification",
        navigationOptions: {
            screen: "LostInternetConnectionNotification",
            autoDismissTimerSec: 10,
            position: "bottom"
        }
    }

    yield put(actions.showInAppNotification(payload))
}

export const kickInactivePlayerSaga = function* () {
    while (true) {
        yield take("KICK_INACTIVE_PLAYER")

        const payload =  {
            fn: "resetTo",
            navigationOptions: {
                screen: "SelectGameMode"
            }
        }
        
        yield put(actions.navigateToScreen(payload))
        yield call(showInactivityMessageSaga)
        
        yield put(simonGameActions.resetGame())
        yield put(simonGameActions.cancelSimonGameSaga())
    }
}
export const watchSocketDisconnected = function* () {
    while (true) {
        yield take("SOCKET_DISCONNECTED")
        console.log("I GOT THE ACTION IN SOCKET DISCONNECTED SAGA")
        
        const navigationOptions = { screen: "StartingScreen" }
        const payload = { fn: "resetTo", navigationOptions }

        yield put(actions.navigateToScreen(payload))
        yield call(showLostInternetConnectionMessageSaga)

        yield put(simonGameActions.resetGame())
        yield put(simonGameActions.cancelSimonGameSaga())
    }
}

export const watchNavigateScreens = function* () {
    yield takeLatest(actions.navigateToScreen, navigateScreens)
}

export const navigateScreens = function* (action) {
    const { fn, navigationOptions } = action.payload

    if (AppState.currentState !== "active") {
        console.log("WAITING FOR THE APP TO GO ACTIVE")
        yield take("APP_ACTIVE")
    }

    ReactNativeNavigator[fn](navigationOptions)
    console.log("END OF navigateScreens* ()")     
}

export default root
