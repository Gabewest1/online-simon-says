import { createActions, handleActions } from "redux-actions"

const {
    login,
    loginError,
    loginSuccess,
    logout,
    playAsGuest,
    setRanking,
    register,
    updateStats
} = createActions(
    "LOGIN",
    "LOGIN_ERROR",
    "LOGIN_SUCCESS",
    "LOGOUT",
    "PLAY_AS_GUEST",
    "SET_RANKING",
    "REGISTER",
    "UPDATE_STATS"
)

export const actions = {
    login,
    loginError,
    loginSuccess,
    logout,
    playAsGuest,
    setRanking,
    register,
    updateStats
}

const initialState = {
    isLoggedIn: false,
    isLoading: false,
    token: null,
    info: {},
    ranking: "N/A",
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
    [updateStats]: (state, action) => ({ ...state, info: action.payload })
}, initialState)
