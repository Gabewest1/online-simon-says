import { createActions, handleActions } from "redux-actions"

const {
    exit,
    giveSagasNavigator,
    showBackoutWarningMessage,
    stay,
    navigateToScreen
} = createActions(
    "EXIT",
    "GIVE_SAGAS_NAVIGATOR",
    "SHOW_BACKOUT_WARNING_MESSAGE",
    "STAY",
    "NAVIGATE_TO_SCREEN",
)

export const actions = {
    exit,
    giveSagasNavigator,
    showBackoutWarningMessage,
    stay,
    navigateToScreen
}

const initialState = {
    
}

export default handleActions({

}, initialState)
