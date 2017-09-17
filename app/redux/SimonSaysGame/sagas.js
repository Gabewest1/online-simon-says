import { delay, takeEvery } from "redux-saga"
import { all, call, put, race, select, take } from "redux-saga/effects"
import { actions, selectors } from "./index"

export const ANIMATION_DURATION = 200

const root = function* () {
    yield [
        watchSimonGameSaga()
    ]
}

export const watchSimonGameSaga = function* () {
    console.log("S")
    yield takeEvery(actions.startGame, simonGameSaga)
}

export const simonGameSaga = function* () {
    const state = yield select()
    console.log("STATE:", state)
    const players = yield select(selectors.getPlayers)
    let playerPerforming = yield select(selectors.selectPerformingPlayer)
    let isGameOver = yield select(selectors.isGameOver)

    while (!isGameOver) {
        yield call(setNextMove)
        yield call(displayMovesToPerform)
        yield call(performPlayersTurn, playerPerforming)
        yield call(endTurn)
        isGameOver = true
    }
}

export const displayMovesToPerform = function* () {
    let movesToPerform = yield select(selectors.getMoves)
    yield call(delay, 1000)

    for (let move of movesToPerform) {
        yield call(animateSimonPad, { pad: move, isValid: true })
        yield call(delay, ANIMATION_DURATION)
    }
}

export const setNextMove = function* () {
    //Moves are numbers 0-3 representing the index of the pad
    let nextMove = Math.floor(Math.random() * 4)
    yield put(actions.addNextMove(nextMove))
}

export const performPlayersTurn = function* (player) {
    const movesToPerform = yield select(selectors.getMoves)
    // console.log("MOVES TO PERFORM:", movesToPerform)
    let movesPerformed = 0

    while (movesPerformed < movesToPerform.length) {
        let { playersMove, timedout } = yield race({
            playersMove: take(actions.simonPadClicked),
            timedout: call(delay, 1000)
        })

        if (timedout) {
            yield put(actions.eliminatePlayer(player))
            break
        }

        const isValidMove = playersMove.payload === movesToPerform[movesPerformed]

        if (!isValidMove) {
            yield put(actions.eliminatePlayer(player))
            break
        }

        const pad = { pad: playersMove.payload, isValid: isValidMove }
        yield call(animateSimonPad, pad)

        movesPerformed++
    }
}

export const savePlayersStats = function* () {
    
}

export const endTurn = function* () {
    console.log("ENDING THE GAME")
    yield put(actions.gameOver())
}

export const animateSimonPad = function* ({ pad, isValid }) {
    console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad({ pad, isValid }))
    yield call(delay, ANIMATION_DURATION)
    yield put(actions.animateSimonPad({ pad, isValid }))
}


export default root
