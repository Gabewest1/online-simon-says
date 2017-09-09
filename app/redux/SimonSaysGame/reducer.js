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
    resetMoveCounter
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
    "RESET_MOVE_COUNTER"
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
    resetMoveCounter
}

const padsReducer = handleActions({
    [animateSimonPad]: (state, { payload: { pad, isValid } }) =>
        ({ ...state, [pad]: { ...state[pad], isAnimating: true, isValid }})
}, {
    0: { isAnimating: false, isValid: undefined },
    1: { isAnimating: false, isValid: undefined },
    2: { isAnimating: false, isValid: undefined },
    3: { isAnimating: false, isValid: undefined }
})

const movesReducer = handleActions({
    [addNextMove]: (state, { payload }) => ({ ...state, moves: [...state.moves, payload] }),
    [increaseMoveCounter]: state => ({ ...state, moveCounter: state.moveCounter + 1 }),
    [resetMoveCounter]: state => ({ ...state, moveCounter: 0 })
}, { moves: [], moveCounter: 0 })

const playersReducer = handleActions({

}, { players: [], eliminatedPlayer: [], playerPerforming: 0 })

const gameReducer = handleActions({
    [addNextMove]: (state, { payload }) => ({ ...state, moves: [...state.moves, payload] })
}, { round: 0, isGameOver: false, winner: undefined })

export default {
    pads: padsReducer,
    moves: movesReducer,
    players: playersReducer,
    game: gameReducer
}
