import { createActions, handleActions } from "redux-actions"
import { combineReducers } from "redux"

const {
    setGameMode,
    simonPadClicked,
    animateSimonPad,
    startGame,
    resetGame,
    cancelSimonGameSaga,
    gameOver,
    startTurn,
    endTurn,
    setWinner,
    advanceTurn,
    eliminatePlayer,
    restartGame,
    addNextMove,
    setMoveIndex,
    increaseMoveCounter,
    resetMoveCounter,
    setPlayers,
    addPlayer,
    removePlayer,
    setPerformingPlayer,
    increaseRoundCounter,
    findMatch,
    foundMatch,
    cancelSearch,
    cancelPrivateMatch,
    setIsScreenDarkened,
    decreaseTimer,
    resetTimer,
    playerFinishedTurn,
    invitePlayer,
    createPrivateMatch,
    playerAcceptedChallenge,
    playerDeclinedChallenge,
    playerQuitMatch,
    playerReady,
    playerNotReady
} = createActions(
    "SET_GAME_MODE",
    "SIMON_PAD_CLICKED",
    "ANIMATE_SIMON_PAD",
    "START_GAME",
    "RESET_GAME",
    "CANCEL_SIMON_GAME_SAGA",
    "GAME_OVER",
    "START_TURN",
    "END_TURN",
    "SET_WINNER",
    "ADVANCE_TURN",
    "ELIMINATE_PLAYER",
    "RESTART_GAME",
    "ADD_NEXT_MOVE",
    "SET_MOVE_INDEX",
    "INCREASE_MOVE_COUNTER",
    "RESET_MOVE_COUNTER",
    "SET_PLAYERS",
    "ADD_PLAYER",
    "REMOVE_PLAYER",
    "SET_PERFORMING_PLAYER",
    "INCREASE_ROUND_COUNTER",
    "FIND_MATCH",
    "FOUND_MATCH",
    "CANCEL_SEARCH",
    "CANCEL_PRIVATE_MATCH",
    "SET_IS_SCREEN_DARKENED",
    "DECREASE_TIMER",
    "RESET_TIMER",
    "PLAYER_FINISHED_TURN",
    "INVITE_PLAYER",
    "CREATE_PRIVATE_MATCH",
    "PLAYER_ACCEPTED_CHALLENGE",
    "PLAYER_DECLINED_CHALLENGE",
    "PLAYER_QUIT_MATCH",
    "PLAYER_READY",
    "PLAYER_NOT_READY"
)

export const actions = {
    setGameMode,
    simonPadClicked,
    animateSimonPad,
    startGame,
    resetGame,
    cancelSimonGameSaga,
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
    setPlayers,
    addPlayer,
    setMoveIndex,
    removePlayer,
    setPerformingPlayer,
    increaseRoundCounter,
    findMatch,
    foundMatch,
    cancelSearch,
    cancelPrivateMatch,
    setIsScreenDarkened,
    decreaseTimer,
    resetTimer,
    playerFinishedTurn,
    invitePlayer,
    createPrivateMatch,
    playerAcceptedChallenge,
    playerDeclinedChallenge,
    playerQuitMatch,
    playerReady,
    playerNotReady
}

const padsReducerInitialState = {
    lit: 0
}
export const padsReducer = handleActions({
    [resetGame]: (state, action) => padsReducerInitialState,
    [animateSimonPad]: (state, { payload }) => ({ ...state, lit: payload }) 
}, padsReducerInitialState)

export const movesReducer = handleActions({
    [resetGame]: () => [],
    [addNextMove]: (state, { payload }) => [...state, payload]
}, [])

export const playersReducer = handleActions({
    [resetGame]: (state, action) => [],
    [cancelSearch]: (state, action) => [],
    [cancelPrivateMatch]: (state, action) => [],
    [setPlayers]: (state, action) => action.payload,
    [addPlayer]: (state, { payload }) => state.concat(payload),
    [removePlayer]: (state, { payload }) => state.filter(player => player.username !== payload.username ),
    [eliminatePlayer]: (state, { payload }) => state.map(player => player.username === payload.username ? { ...player, isEliminated: true } : player),
}, [])

const gameReducerInitialState = {
    gameMode: 1,
    hasFoundMatch: false,
    isGameOver: false,
    isScreenDarkened: false,
    performingPlayer: undefined,
    round: 0,
    moveIndex: 0,
    timer: 15,   //seconds
    winner: undefined
}

export const gameReducer = handleActions({
    [gameOver]: (state, action) => ({ ...state, isGameOver: true }),
    [increaseRoundCounter]: (state, action) => ({ ...state, round: state.round + 1, moveIndex: 0 }),
    [foundMatch]: (state, action) => ({ ...state, hasFoundMatch: true }),
    [setIsScreenDarkened]: (state, action) => ({ ...state, isScreenDarkened: action.payload }),
    [decreaseTimer]: (state, action) => ({ ...state, timer: state.timer - 1 }),
    [setGameMode]: (state, action) => ({ ...state, gameMode: action.payload }),
    [setPerformingPlayer]: (state, action) => ({ ...state, performingPlayer: action.payload }),
    [resetTimer]: (state, action) => ({ ...state, timer: 15 }),
    [setMoveIndex]: (state, action) => ({ ...state, moveIndex: action.payload }),
    [setWinner]: (state, action) => ({ ...state, winner: action.payload }),
    [simonPadClicked]: (state, action) => ({ ...state, moveIndex: state.moveIndex + 1 }),
    [resetGame]: (state, action) => ({ ...gameReducerInitialState })
}, gameReducerInitialState)

export default combineReducers({
    pads: padsReducer,
    moves: movesReducer,
    players: playersReducer,
    game: gameReducer
})
