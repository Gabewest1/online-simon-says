import { createActions, handleActions } from "redux-actions"

const {
    login,
    loginError,
    loginSuccess
} = createActions(
    "LOGIN",
    "LOGIN_ERROR",
    "LOGIN_SUCCESS"
)

export const actions = {
    login,
    loginError,
    loginSuccess
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
        token: action.token,
        info: action.user
    }),
    [loginError]: (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })
}, initialState)

