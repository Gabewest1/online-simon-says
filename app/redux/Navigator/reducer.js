import { createActions, handleActions } from "redux-actions"

const {
    exit,
    giveSagasNavigator,
    showBackoutWarningMessage,
    stay,
    navigateToScreen,
    showInAppNotification
} = createActions(
    "EXIT",
    "GIVE_SAGAS_NAVIGATOR",
    "SHOW_BACKOUT_WARNING_MESSAGE",
    "STAY",
    "NAVIGATE_TO_SCREEN",
    "SHOW_IN_APP_NOTIFICATION"
)

export const actions = {
    exit,
    giveSagasNavigator,
    showBackoutWarningMessage,
    stay,
    navigateToScreen,
    showInAppNotification
}

const initialState = {
    
}

export default handleActions({

}, initialState)
