import { createActions, handleActions } from "redux-actions"

const {
    appStateActive,
    appStateBackground,
    exit,
    giveSagasNavigator,
    navigateToScreen,
    setCurrentScreenName,
    showBackoutWarningMessage,
    showConnectingToServerMessage,
    showInAppNotification,
    socketConnected,
    socketDisconnected,
    socketReconnected,
    socketReconnecting,
    stay
} = createActions(
    "APP_STATE_ACTIVE",
    "APP_STATE_BACKGROUND",
    "EXIT",
    "GIVE_SAGAS_NAVIGATOR",
    "NAVIGATE_TO_SCREEN",
    "SET_CURRENT_SCREEN_NAME",
    "SHOW_BACKOUT_WARNING_MESSAGE",
    "SHOW_CONNECTING_TO_SERVER_MESSAGE",
    "SHOW_IN_APP_NOTIFICATION",
    "SOCKET_CONNECTED",
    "SOCKET_DISCONNECTED",
    "SOCKET_RECONNECTED",
    "SOCKET_RECONNECTING",
    "STAY"
)

export const actions = {
    appStateActive,
    appStateBackground,
    exit,
    giveSagasNavigator,
    navigateToScreen,
    setCurrentScreenName,
    showBackoutWarningMessage,
    showConnectingToServerMessage,
    showInAppNotification,
    socketConnected,
    socketDisconnected,
    socketReconnected,
    socketReconnecting,
    stay
}

const initialState = {
    currentScreenName: "",
    online: false,
    reconnecting: false,
    error: false
}

export default handleActions({
    [setCurrentScreenName]: (state, action) => ({ ...state, currentScreenName: action.payload }),
    [socketDisconnected]: (state, action) => ({ ...state, online: false }),
    [socketReconnected]: (state, action) => ({ ...state, online: true, reconnecting: false }),
    [socketReconnecting]: (state, action) => ({ ...state, reconnecting: true }),
    [socketConnected]: (state, action) => ({ ...state, online: true })
}, initialState)
