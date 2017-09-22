import { delay, takeEvery } from "redux-saga"
import { all, call, fork, put, race, select, take } from "redux-saga/effects"
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

export const simonGameSaga = function* (action) {
    const gameMode = action.payload

    if (gameMode === "single") {
        yield call(singlePlayerGame)
    } else if (gameMode === "multiplayer") {
        // yield call(multiplayerGame)
    }

}

export const multiplayerGame = function* () {

}

export const singlePlayerGame = function* () {
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
        isGameOver = yield select(selectors.isGameOver)
        console.log("IS GAME OVER:", isGameOver)
    }
}


export const displayMovesToPerform = function* () {
    let movesToPerform = yield select(selectors.getMoves)
    yield call(delay, 1000)

    for (let move of movesToPerform) {
        yield call(animateSimonPad, { pad: move, isValid: true })
        yield call(delay, 500)    //Wait half a second between each move
    }
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
            break
        }

        const isValidMove = playersMove.payload === movesToPerform[movesPerformed]

        if (!isValidMove) {
            yield put(actions.eliminatePlayer(player))
            break
        }

        const pad = { pad: playersMove.payload, isValid: isValidMove }
        yield fork(animateSimonPad, pad)

        movesPerformed++
    }
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
