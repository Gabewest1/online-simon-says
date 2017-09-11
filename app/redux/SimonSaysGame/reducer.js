import { createActions, handleActions } from "redux-actions"

const {
    simonPadClicked,
    animateSimonPad,
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
    setPlayersTurn
} = createActions(
    "SIMON_PAD_CLICKED",
    "ANIMATE_SIMON_PAD",
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
    "SET_PLAYERS_TURN"
)

export const actions = {
    simonPadClicked,
    animateSimonPad,
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
    setPlayersTurn
}

const padsReducer = handleActions({
    [animateSimonPad]: (state, { payload: { pad, isValid } }) =>
        ({ ...state, [pad]: { ...state[pad], isAnimating: true, isValid }})
}, [
    { isAnimating: false, isValid: undefined },
    { isAnimating: false, isValid: undefined },
    { isAnimating: false, isValid: undefined },
    { isAnimating: false, isValid: undefined }
])

const movesReducer = handleActions({
    [addNextMove]: (state, { payload }) => ({ ...state, moves: [...state.moves, payload] }),
    [increaseMoveCounter]: state => ({ ...state, moveCounter: state.moveCounter + 1 }),
    [resetMoveCounter]: state => ({ ...state, moveCounter: 0 })
}, { moves: [], moveCounter: 0 })

const playersReducer = handleActions({
    [addPlayer]: (state, { payload }) => state.concat(payload),
    [removePlayer]: (state, { payload }) => state.filter(player => player !== payload ),
    [eliminatePlayer]: (state, { payload }) => state.map(player => player === payload ? { ...player, isEliminated: true } : player),
    [setPlayersTurn]: (state, { payload }) => state.map(player => player === payload ? { ...player, isMyTurn: true } : { ...player, isMyTurn: false })
}, [])

const gameReducer = handleActions({
    [addNextMove]: (state, { payload }) => ({ ...state, moves: [...state.moves, payload] })
}, { round: 0, isGameOver: false, winner: undefined })

export default {
    pads: padsReducer,
    moves: movesReducer,
    players: playersReducer,
    game: gameReducer
}
