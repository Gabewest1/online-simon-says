import { createActions, handleActions } from "redux-actions"
import { actions as navigatorActions } from "../Navigator"

const {
    login,
    loginError,
    loginSuccess,
    logout,
    playAsGuest,
    setRanking,
    register,
    updateStats,
    setPassword
} = createActions(
    "LOGIN",
    "LOGIN_ERROR",
    "LOGIN_SUCCESS",
    "LOGOUT",
    "PLAY_AS_GUEST",
    "SET_RANKING",
    "REGISTER",
    "UPDATE_STATS",
    "SET_PASSWORD"
)

export const actions = {
    login,
    loginError,
    loginSuccess,
    logout,
    playAsGuest,
    setRanking,
    register,
    updateStats,
    setPassword
}

const initialState = {
    isLoggedIn: false,
    isLoading: false,
    token: null,
    info: {},
    ranking: "N/A",
    password: undefined, //This password state is only used for the sign in screens password input bar. Need the decrypted version b/c info.password is encrypted.
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
        error: action.payload
    }),
    [logout]: (state, action) => initialState,
    [setRanking]: (state, action) => ({ ...state, ranking: action.payload }),
    [register]: (state, action) => ({ ...state, isLoading: true }),
    [updateStats]: (state, action) => ({ ...state, info: action.payload }),
    [setPassword]: (state, action) => ({ ...state, password: action.payload }),
    [navigatorActions.socketDisconnected]: (state, action) => ({ ...state, isLoading: false })
}, initialState)
