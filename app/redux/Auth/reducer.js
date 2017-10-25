import { createActions, handleActions } from "redux-actions"

const {
    login,
    loginError,
    loginSuccess,
    logout,
    giveSagasNavigator,
    playAsGuest,
    register,
    updateStats
} = createActions(
    "LOGIN",
    "LOGIN_ERROR",
    "LOGIN_SUCCESS",
    "LOGOUT",
    "GIVE_SAGAS_NAVIGATOR",
    "PLAY_AS_GUEST",
    "REGISTER",
    "UPDATE_STATS"
)

export const actions = {
    login,
    loginError,
    loginSuccess,
    logout,
    giveSagasNavigator,
    playAsGuest,
    register,
    updateStats
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
        error: action.payload
    }),
    [logout]: (state, action) => initialState,
    [register]: (state, action) => ({ ...state, isLoading: true }),
    [updateStats]: (state, action) => ({ ...state, info: action.payload })
}, initialState)
