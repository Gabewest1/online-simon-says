import { AppState, Platform } from "react-native"
import { call, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects"
import { actions, selectors } from "./index"
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
        watchSocketReconnected(),
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
        const navigationOptions = {
            screen: "SelectGameMode"
        }

        const action = { payload: { fn: "resetTo", navigationOptions }}

        yield call(navigateScreens, action)
    }
}

export const watchShowInAppNotification = function* () {
    yield takeEvery(actions.showInAppNotification, showInAppNotificationSaga)
}
export const showInAppNotificationSaga = function* (action) {
    const { fn, navigationOptions } = action.payload
    
    if (AppState.currentState !== "active") {
        yield take("APP_STATE_ACTIVE")
    }

    ReactNativeNavigator[fn](navigationOptions)
}
export const showInactivityMessageSaga = function* () {
    const message = "You were kicked for inactivity."

    const payload = {
        fn: "showInAppNotification",
        navigationOptions: {
            screen: "Notification",
            autoDismissTimerSec: 7,
            passProps: { message },
            position: "bottom"
        }
    }

    yield put(actions.showInAppNotification(payload))
}
export const showLostInternetConnectionNotificationSaga = function* () {
    const message = "Connection Lost... :("

    const payload = {
        fn: "showInAppNotification",
        navigationOptions: {
            screen: "Notification",
            autoDismissTimerSec: 5,
            passProps: { message },
            position: "bottom"
        }
    }

    yield put(actions.showInAppNotification(payload))
}

export const showFoundInternetConnectionNotification = function* () {
    const message = "Connection Established! :D"

    const payload = {
        fn: "showInAppNotification",
        navigationOptions: {
            screen: "Notification",
            autoDismissTimerSec: 5,
            passProps: { message },
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
        yield call(showLostInternetConnectionNotificationSaga)

        yield put(simonGameActions.resetGame())
        yield put(simonGameActions.cancelSimonGameSaga())
    }
}
export const watchSocketReconnected = function* () {
    while (true) {
        yield take("SOCKET_RECONNECTED")
        
        yield call(showFoundInternetConnectionNotification)

    }
}

export const watchNavigateScreens = function* () {
    yield takeLatest(actions.navigateToScreen, navigateScreens)
}

export const navigateScreens = function* (action) {
    const { fn, navigationOptions } = action.payload

    const currentScreenName = yield select(selectors.getCurrentScreenName)
    const nextScreenName = navigationOptions.screen

    console.log(`Going from ${currentScreenName} to ${nextScreenName}`)

    if (currentScreenName === nextScreenName) {
        return
    }

    if (AppState.currentState !== "active") {
        console.log("WAITING FOR THE APP TO GO ACTIVE")
        yield take("APP_STATE_ACTIVE")
    }

    ReactNativeNavigator[fn](navigationOptions)

    yield put(actions.setCurrentScreenName(nextScreenName))

    console.log("END OF navigateScreens* ()")
}

export default root
