import { AppState, Platform } from "react-native"
import { call, put, fork, race, select, take, takeEvery, takeLatest } from "redux-saga/effects"
import { actions, selectors } from "./index"
import { actions as simonGameActions, selectors as simonGameSelctors } from "../SimonSaysGame"
import { selectors as userSelectors } from "../Auth"

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
        yield fork(showInactivityMessageSaga)

        yield put(simonGameActions.resetGame())
        yield put(simonGameActions.cancelSimonGameSaga())
    }
}
export const watchSocketDisconnected = function* () {

    const handleGuestDisconnection = function* () {
        const currentScreenName = yield select(selectors.getCurrentScreenName)
        const gameMode = yield select(simonGameSelctors.getGameMode)
        const navigationOptions = {}

        switch (currentScreenName) {
            case "SimonGameScreen":
                navigationOptions.screen = gameMode > 1 ? "SelectGameMode" : "SimonGameScreen"
                break

            case "GameOverScreen":
                navigationOptions.screen = gameMode > 1 ? "SelectGameMode" : "GameOverScreen"
                break

            case "SelectOnlineGameMode":
            case "FindMatchScreen":
            case "InvitePlayersScreen":
                navigationOptions.screen = "SelectGameMode"
                break

            case "SignUpScreen":
                navigationOptions.screen = "StartingScreen"
                break

            default:
                navigationOptions.screen = currentScreenName
        }

        return navigationOptions
    }
    const handleLoggedInUserDisconnection = function* () {
        const navigationOptions = { screen: "StartingScreen" }

        return navigationOptions
    }

    while (true) {
        yield take("SOCKET_DISCONNECTED")
        const user = yield select(userSelectors.getUser)

        const navigationOptions = user.isAGuest 
            ? yield call(handleGuestDisconnection)
            : yield call(handleLoggedInUserDisconnection)

        const payload = { fn: "resetTo", navigationOptions }

        yield put(actions.navigateToScreen(payload))
        yield fork(showLostInternetConnectionNotificationSaga)

        //Guests should be able to continue playing without internet
        //Logged in users should have their games ended and reset.
        if (!user.isAGuest) {
            yield put(simonGameActions.resetGame())
            yield put(simonGameActions.cancelSimonGameSaga())
        }
    }
}
export const watchSocketReconnected = function* () {
    while (true) {
        yield take("SOCKET_RECONNECTED")
        const user = yield select(userSelectors.getUser)

        yield fork(showFoundInternetConnectionNotification)

        if (user.isAGuest) {
            yield put({ type: "server/SET_SOCKET_PLAYER", payload: user })
        }
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

    //I don't know if this statement is needed but i want to ensure that multiple instances
    //of a game don't somehow spawn.
    if (currentScreenName === nextScreenName) {
        if (currentScreenName === "SimonGameScreen") {
            return
        }
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
