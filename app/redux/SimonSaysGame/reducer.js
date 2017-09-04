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
    addNextMove
} = createActions(
    "SIMON_PAD_CLICKED",
    "ANIMATE_SIMON_PAD",
    "GAME_OVER",
    "START_TURN",
    "END_TURN",
    "ADVANCE_TURN",
    "ELIMINATE_PLAYER",
    "RESTART_GAME",
    "ADD_NEXT_MOVE"
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
    addNextMove
}

const padsReducer = handleActions({

}, { isAnimating: false, animatingPad: -1 })

const gameReducer = handleActions({
    [addNextMove]: (state, { payload }) => ({ ...state, moves: [...state.moves, payload] })
}, {
    isGameOver: false,
    winner: undefined,
    moves: [],
    round: 0,
    currentMoveIndex: 0
})

export default {
    pads: padsReducer,
    game: gameReducer
}
