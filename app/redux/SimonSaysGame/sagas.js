import { delay, takeEvery } from "redux-saga"
import { all, call, fork, put, race, select, take } from "redux-saga/effects"
import { actions, selectors } from "./index"

export const ANIMATION_DURATION = 200
const ONLINE_GAME = 0
const LOCAL_GAME = 1

let GAME_MODE 

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

        const { foundMatch, cancelSearch } = yield race({
            foundMatch: take(actions.foundMatch),
            cancelSearch: take(actions.cancelSearch)
        })

        //I'm passing in the gameMode as a payload even though on the server my
        //GameRoomManager doesn't use a gameMode to cancel a search. But, passing
        //in the gameMode could be used a performance boost for finding the players
        //game room and canceling their search.
        if (cancelSearch) {
            yield put({ type: "server/CANCEL_SEARCH", payload: gameMode })
        }
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
        GAME_MODE = LOCAL_GAME
    } else if (gameMode === "multiplayer") {
        yield call(multiplayerGame)
        GAME_MODE = ONLINE_GAME
    }

}

export const multiplayerGame = function* () {
    const state = yield select()
    console.log("STATE:", state)
    let isGameOver = selectors.isGameOver(state)
    let playerPerforming

    while (!isGameOver) {
        playerPerforming = yield select(selectors.selectPerformingPlayer)
        
        if (/* its my turn */false) {
            const playerPassed = yield call(performPlayersTurn, playerPerforming)
        } else {
            //wait for player to perform their turn. Need to know if the player
            //performed their turn successfully or not.
        }

        if (playerPassed) {
            yield call(setNextMove)
        }

        yield call(endTurn)
        isGameOver = yield select(selectors.isGameOver)
        console.log("IS GAME OVER:", isGameOver)
    }
}

export const singlePlayerGame = function* () {
    while (!(isGameOver = yield select(selectors.isGameOver))) {
        yield call(setNextMove)
        yield call(displayMovesToPerform)
        yield call(performPlayersTurn, playerPerforming)
        yield call(endTurn)
    }
}


export const displayMovesToPerform = function* () {
    let movesToPerform = yield select(selectors.getMoves)
    yield put(actions.setIsScreenDarkened(true))
    yield call(delay, 1000)

    for (let move of movesToPerform) {
        yield call(animateSimonPad, { pad: move, isValid: true })
        yield call(delay, 500)    //Wait half a second between each move
    }

    yield put(actions.setIsScreenDarkened(false))
}

export const setNextMove = function* () {
    //Moves are numbers 0-3 representing the index of the pad
    let nextMove = Math.floor(Math.random() * 4)
    yield put(actions.addNextMove(nextMove))
}

export const startTimer = function* () {
    let timeTillPlayerTimesout = yield select(selectors.getTimer)

    while (timeTillPlayerTimesout > 0) {
        yield put(actions.decreaseTimer())
        timeTillPlayerTimesout--

        let { playersMove, timedout } = yield race({
            playersMove: take(actions.simonPadClicked),
            timedout: call(delay, 1000)
        })

        if (playersMove) {
            return { playersMove, timedout: false }
        } else if (timeTillPlayerTimesout === 0) {
            return { playersMove: false, timedout: true }
        }
    }
}

export const getPlayersMove = function* (isFirstMove) {
    if (isFirstMove) {
        let { playersMove, timedout } = yield call(startTimer)

        return { playersMove, timedout }
    } else {
        let { playersMove, timedout } = yield race({
            playersMove: take(actions.simonPadClicked),
            timedout: call(delay, 1000)
        })

        return { playersMove, timedout }
    }

}

export const eliminatePlayer = function* (player) {

}

export const performPlayersTurn = function* (player) {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0

    while (movesPerformed < movesToPerform.length) {
        console.log("WAITING FOR YOU TO MAKE A MOVE")
        let isPlayersFirstMove = movesPerformed === 0

        let { playersMove, timedout } = yield call(getPlayersMove, isPlayersFirstMove)

        console.log("MOVE:", playersMove, timedout)
        if (timedout) {
            yield put(actions.eliminatePlayer(player))
            
            return false
        }

        const isValidMove = playersMove.payload === movesToPerform[movesPerformed]
        const pad = { pad: playersMove.payload, isValid: isValidMove }
        yield fork(animateSimonPad, pad)

        if (!isValidMove) {
            yield put(actions.eliminatePlayer(player))
            
            return false
        }

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
    //This line should be a selector
    const playersStillPlaying = players.filter(player => player.isEliminated === false)

    console.log("PLAYERS STILL PLAYING:", playersStillPlaying)
    //if its a single player game then the length should be 0.
    //if its a multiplayer game then the length should be 1.
    if (playersStillPlaying.length === 0) {
        yield put(actions.gameOver())
    } else {
        console.log("PASSED THE ROUND :D")
        yield put(actions.resetTimer())
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
