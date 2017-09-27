import { delay, takeEvery } from "redux-saga"
import { all, call, fork, put, race, select, take } from "redux-saga/effects"
import { actions, selectors } from "./index"

export const ANIMATION_DURATION = 200

const root = function* () {
    yield [
        watchSimonGameSaga(),
        watchFindMatch()
    ]
}

export const watchFindMatch = function* () {
    while (true) {
        const { payload: gameMode } = yield take(actions.findMatch)
        yield put({ type: "server/FIND_MATCH", gameMode })
    }
}
export const watchSimonGameSaga = function* () {
    console.log("S")
    yield takeEvery(actions.startGame, simonGameSaga)
}

export const simonGameSaga = function* (action) {
    const gameMode = action.payload

    if (gameMode === 1) {
        yield call(singlePlayerGame)
    } else if (gameMode === "multiplayer") {
        // yield call(multiplayerGame)
    }

}

export const multiplayerGame = function* () {
    const state = yield select()
    console.log("STATE:", state)
    let isGameOver = yield select(selectors.isGameOver)
    let playerPerforming

    while (!isGameOver) {
        playerPerforming = yield select(selectors.selectPerformingPlayer)
        
        const playerPassed = yield call(performPlayersTurn, playerPerforming)

        if (playerPassed) {
            yield call(setNextMove)
        }

        yield call(endTurn)
        isGameOver = yield select(selectors.isGameOver)
        console.log("IS GAME OVER:", isGameOver)
    }
}

export const singlePlayerGame = function* () {
    const state = yield select()
    console.log("STATE:", state)
    let playerPerforming = yield select(selectors.selectPerformingPlayer)
    let isGameOver = yield select(selectors.isGameOver)

    while (!isGameOver) {
        yield call(setNextMove)
        yield call(displayMovesToPerform)
        yield call(performPlayersTurn, playerPerforming)
        yield call(endTurn)
        isGameOver = yield select(selectors.isGameOver)
        console.log("IS GAME OVER:", isGameOver)
    }
}


export const displayMovesToPerform = function* () {
    let movesToPerform = yield select(selectors.getMoves)
    yield put(actions.setIsDisplayingMoves(true))
    yield call(delay, 1000)

    for (let move of movesToPerform) {
        yield call(animateSimonPad, { pad: move, isValid: true })
        yield call(delay, 500)    //Wait half a second between each move
    }

    yield put(actions.setIsDisplayingMoves(false))
}

export const setNextMove = function* () {
    //Moves are numbers 0-3 representing the index of the pad
    let nextMove = Math.floor(Math.random() * 4)
    yield put(actions.addNextMove(nextMove))
}

export const performPlayersTurn = function* (player) {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0

    while (movesPerformed < movesToPerform.length) {
        console.log("WAITING FOR YOU TO MAKE A MOVE")
    
        let { playersMove, timedout } = yield race({
            playersMove: take(actions.simonPadClicked),
            timedout: call(delay, 1000)
        })

        console.log("MOVE:", playersMove, timedout)
        if (timedout) {
            yield put(actions.eliminatePlayer(player))
            return false
        }

        const isValidMove = playersMove.payload === movesToPerform[movesPerformed]

        if (!isValidMove) {
            yield put(actions.eliminatePlayer(player))
            return false
        }

        const pad = { pad: playersMove.payload, isValid: isValidMove }
        yield fork(animateSimonPad, pad)

        movesPerformed++
    }

    return true
}

export const savePlayersStats = function* () {
    
}

export const endTurn = function* () {
    console.log("ENDING THE GAME")
    const players = yield select(selectors.getPlayers)
    console.log("players:", players)
    const playersStillPlaying = players.filter(player => player.isEliminated === false)

    console.log("PLAYERS STILL PLAYING:", playersStillPlaying)

    if (playersStillPlaying.length === 0) {
        yield put(actions.gameOver())
    } else {
        console.log("PASSED THE ROUND :D")
        yield put(actions.increaseRoundCounter())
    }
}

export const animateSimonPad = function* ({ pad, isValid }) {
    console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad({ pad, isValid }))
    yield call(delay, ANIMATION_DURATION)
    yield put(actions.animateSimonPad({ pad, isValid }))
}


export default root
