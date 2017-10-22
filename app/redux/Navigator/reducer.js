import { createActions, handleActions } from "redux-actions"

const {
    exit,
    giveSagasNavigator,
    showBackoutWarningMessage,
    stay
} = createActions(
    "EXIT",
    "GIVE_SAGAS_NAVIGATOR",
    "SHOW_BACKOUT_WARNING_MESSAGE",
    "STAY"
)

export const actions = {
    exit,
    giveSagasNavigator,
    showBackoutWarningMessage,
    stay
}

const initialState = {
    
}

export default handleActions({

}, initialState)
