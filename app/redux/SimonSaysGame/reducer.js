import { createActions, handleActions } from "redux-actions"
import { combineReducers } from "redux"

const {
    simonPadClicked,
    animateSimonPad,
    startGame,
    resetGame,
    gameOver,
    startTurn,
    endTurn,
    setWinner,
    advanceTurn,
    eliminatePlayer,
    restartGame,
    addNextMove,
    increaseMoveCounter,
    resetMoveCounter,
    addPlayer,
    removePlayer,
    setPerformingPlayer,
    increaseRoundCounter,
    findMatch,
    foundMatch,
    cancelSearch,
    setIsScreenDarkened,
    decreaseTimer,
    resetTimer,
    playerFinishedTurn
} = createActions(
    "SIMON_PAD_CLICKED",
    "ANIMATE_SIMON_PAD",
    "START_GAME",
    "RESET_GAME",
    "GAME_OVER",
    "START_TURN",
    "END_TURN",
    "SET_WINNER",
    "ADVANCE_TURN",
    "ELIMINATE_PLAYER",
    "RESTART_GAME",
    "ADD_NEXT_MOVE",
    "INCREASE_MOVE_COUNTER",
    "RESET_MOVE_COUNTER",
    "ADD_PLAYER",
    "REMOVE_PLAYER",
    "SET_PERFORMING_PLAYER",
    "INCREASE_ROUND_COUNTER",
    "FIND_MATCH",
    "FOUND_MATCH",
    "CANCEL_SEARCH",
    "SET_IS_SCREEN_DARKENED",
    "DECREASE_TIMER",
    "RESET_TIMER",
    "PLAYER_FINISHED_TURN"
)

export const actions = {
    simonPadClicked,
    animateSimonPad,
    startGame,
    resetGame,
    gameOver,
    startTurn,
    endTurn,
    setWinner,
    advanceTurn,
    eliminatePlayer,
    restartGame,
    addNextMove,
    increaseMoveCounter,
    resetMoveCounter,
    addPlayer,
    removePlayer,
    setPerformingPlayer,
    increaseRoundCounter,
    findMatch,
    foundMatch,
    cancelSearch,
    setIsScreenDarkened,
    decreaseTimer,
    resetTimer,
    playerFinishedTurn
}

export const padsReducer = handleActions({
    [animateSimonPad]: (state, { payload: { pad, isValid } }) =>
        state.map((x, i) => pad == i ? { ...x, isAnimating: !x.isAnimating, isValid } : x)
}, [
    { isAnimating: false, isValid: undefined },
    { isAnimating: false, isValid: undefined },
    { isAnimating: false, isValid: undefined },
    { isAnimating: false, isValid: undefined }
])

export const movesReducer = handleActions({
    [resetGame]: () => [],
    [addNextMove]: (state, { payload }) => [...state, payload],
}, [])

export const playersReducer = handleActions({
    [foundMatch]: (state, action) => action.payload,
    [addPlayer]: (state, { payload }) => state.concat(payload),
    [removePlayer]: (state, { payload }) => state.filter(player => player.username !== payload.username ),
    [eliminatePlayer]: (state, { payload }) => state.map(player => player.username === payload.username ? { ...player, isEliminated: true } : player),
}, [])

const gameReducerInitialState = {
    hasFoundMatch: false,
    isGameOver: false,
    isScreenDarkened: false,
    performingPlayer: undefined,
    round: 0,
    timer: 15,   //seconds
    winner: undefined
}

export const gameReducer = handleActions({
    [gameOver]: (state, action) => ({ ...state, isGameOver: true }),
    [increaseRoundCounter]: (state, action) => ({ ...state, round: state.round + 1}),
    [foundMatch]: (state, action) => ({ ...state, hasFoundMatch: true }),
    [setIsScreenDarkened]: (state, action) => ({ ...state, isScreenDarkened: action.payload }),
    [decreaseTimer]: (state, action) => ({ ...state, timer: state.timer - 1 }),
    [setPerformingPlayer]: (state, action) => ({ ...state, performingPlayer: action.payload }),
    [resetTimer]: (state, action) => ({ ...state, timer: 15 }),
    [setWinner]: (state, action) => ({ ...state, winner: action.payload }),
    [resetGame]: (state, action) => ({ ...gameReducerInitialState })
}, gameReducerInitialState)

export default combineReducers({
    pads: padsReducer,
    moves: movesReducer,
    players: playersReducer,
    game: gameReducer
})
