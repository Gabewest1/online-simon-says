import { createActions, handleActions } from "redux-actions"

const {
    login,
    loginError,
    loginSuccess,
    playAsGuest
} = createActions(
    "LOGIN",
    "LOGIN_ERROR",
    "LOGIN_SUCCESS",
    "PLAY_AS_GUEST"
)

export const actions = {
    login,
    loginError,
    loginSuccess,
    playAsGuest
}

const initialState = {
    isLoggedIn: false,
    isLoading: false,
    token: null,
    info: {},
    error: null
}

export default handleActions({
    [login]: (state, action) => ({ ...state, isLoading: true }),
    [loginSuccess]: (state, action) => ({
        ...state,
        isLoggedIn: true,
        isLoading: false,
        token: action.payload.token,
        info: action.payload.user
    }),
    [loginError]: (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }),
}, initialState)

