import { createActions, handleActions } from "redux-actions"
import { combineReducers } from "redux"

const {
    simonPadClicked,
    animateSimonPad,
    startGame,
    gameOver,
    startTurn,
    endTurn,
    advanceTurn,
    eliminatePlayer,
    restartGame,
    addNextMove,
    increaseMoveCounter,
    resetMoveCounter,
    addPlayer,
    removePlayer,
    setPlayersTurn,
    increaseRoundCounter,
    findMatch,
    foundMatch,
    setIsDisplayingMoves,
    decreaseTimer,
    resetTimer
} = createActions(
    "SIMON_PAD_CLICKED",
    "ANIMATE_SIMON_PAD",
    "START_GAME",
    "GAME_OVER",
    "START_TURN",
    "END_TURN",
    "ADVANCE_TURN",
    "ELIMINATE_PLAYER",
    "RESTART_GAME",
    "ADD_NEXT_MOVE",
    "INCREASE_MOVE_COUNTER",
    "RESET_MOVE_COUNTER",
    "ADD_PLAYER",
    "REMOVE_PLAYER",
    "SET_PLAYERS_TURN",
    "INCREASE_ROUND_COUNTER",
    "FIND_MATCH",
    "FOUND_MATCH",
    "SET_IS_DISPLAYING_MOVES",
    "DECREASE_TIMER",
    "RESET_TIMER"
)

export const actions = {
    simonPadClicked,
    animateSimonPad,
    startGame,
    gameOver,
    startTurn,
    endTurn,
    advanceTurn,
    eliminatePlayer,
    restartGame,
    addNextMove,
    increaseMoveCounter,
    resetMoveCounter,
    addPlayer,
    removePlayer,
    setPlayersTurn,
    increaseRoundCounter,
    findMatch,
    foundMatch,
    setIsDisplayingMoves,
    decreaseTimer,
    resetTimer
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
    [addNextMove]: (state, { payload }) => [...state, payload],
    [increaseMoveCounter]: state => ({ ...state, moveCounter: state.moveCounter + 1 }),
    [resetMoveCounter]: state => ({ ...state, moveCounter: 0 })
}, [])

export const playersReducer = handleActions({
    [addPlayer]: (state, { payload }) => state.concat(payload),
    [removePlayer]: (state, { payload }) => state.filter(player => player !== payload ),
    [eliminatePlayer]: (state, { payload }) => state.map(player => player === payload ? { ...player, isEliminated: true } : player),
    [setPlayersTurn]: (state, { payload }) => state.map(player => player === payload ? { ...player, isMyTurn: true } : { ...player, isMyTurn: false })
}, [])

const gameReducerInitialState = {
    hasFoundMatch: false,
    round: 0,
    isGameOver: false,
    winner: undefined,
    isDisplayingMoves: false,
    timer: 15
}

export const gameReducer = handleActions({
    [gameOver]: (state, action) => ({ ...state, isGameOver: true }),
    [increaseRoundCounter]: (state, action) => ({ ...state, round: state.round + 1}),
    [foundMatch]: (state, action) => ({ ...state, hasFoundMatch: true }),
    [setIsDisplayingMoves]: (state, action) => ({ ...state, isDisplayingMoves: action.payload }),
    [decreaseTimer]: (state, action) => ({ ...state, timer: state.timer - 1 }),
    [resetTimer]: (state, action) => ({ ...state, timer: 15 })
}, gameReducerInitialState)

export default combineReducers({
    pads: padsReducer,
    moves: movesReducer,
    players: playersReducer,
    game: gameReducer
})
