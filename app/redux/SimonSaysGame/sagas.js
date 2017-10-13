import { delay, takeEvery } from "redux-saga"
import { all, call, cancel, fork, put, race, select, take } from "redux-saga/effects"
import { actions, selectors } from "./index"
import { selectors as userSelectors } from "../Auth"

export const ANIMATION_DURATION = 1
export const TIMEOUT_TIME = 3
const MULTIPLAYER_GAME = 0
const SINGLE_PLAYER = 1

let GAME_MODE 


const root = function* () {
    yield [
        watchSimonGameSaga(),
        watchFindMatch(),
        watchAnimateSimonPadOnline()
    ]
}

export const watchAnimateSimonPadOnline = function* () {
    while (true) {
        const { payload } = yield take("ANIMATE_SIMON_PAD_ONLINE")
        yield fork(animateSimonPad, payload)
    }
}

export const watchFindMatch = function* () {
    while (true) {
        const { payload: gameMode } = yield take(actions.findMatch)

        yield put({ type: "server/FIND_MATCH", gameMode })

        const { cancelSearch } = yield race({
            cancelSearch: take(actions.cancelSearch),
            foundMatch: take(actions.foundMatch)
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
    yield takeEvery(actions.startGame, simonGameSaga)
}

export const simonGameSaga = function* (action) {
    const gameMode = action.payload

    if (gameMode === 1) {
        GAME_MODE = SINGLE_PLAYER
        yield put(actions.addPlayer({
            username: yield select(userSelectors.getUsername),
            isEliminated: false
        }))
        yield call(singlePlayerGameSaga)
    } else {
        GAME_MODE = MULTIPLAYER_GAME
        yield call(multiplayerGameSaga)
    }

}

export const multiplayerGameSaga = function* () {
    let playerPerforming
    let isItMyTurn
    let playerPassed

    while (!(yield select(selectors.isGameOver))) {
        playerPerforming = yield select(selectors.selectPerformingPlayer)
        isItMyTurn = yield select(selectors.isItMyTurn)

        console.log("WHOS TURN IS IT:", playerPerforming, isItMyTurn)

        if (isItMyTurn) {
            yield put(actions.setIsScreenDarkened(false))
            console.log("ABOUT TO PERFORM MY TURN")
            playerPassed = yield call(performPlayersTurnOnline, playerPerforming)
            console.log("FINISHED MY TURN", playerPassed)
        } else {
            //wait for player to perform their turn. Need to know if the player
            //performed their turn successfully or not.
            yield put(actions.setIsScreenDarkened(true))
            console.log("WAITING FOR THE PLAYER TO FINISH THEIR TURN")
            let { payload } = yield take(actions.opponentFinishedTurn)
            playerPassed = payload
            console.log("PLAYER TO FINISHED THEIR TURN")            
        }

        if (playerPassed) {
            if (isItMyTurn) {
                console.log("IM ABOUT THE SET THE NEXT MOVE")
                yield call(setNextMove)
                console.log("FINISHED SETTING THE NEXT MOVE")
            } else {
                console.log("WAITING FOR THE PLAYER TO ADD NEXT MOVE")        
                yield take(actions.addNextMove)
                console.log("PLAYER ADDED NEXT MOVE")                        
            }
        }

        yield call(endTurn)
    }
}

export const singlePlayerGameSaga = function* () {
    const [ playerPerforming ] = yield select(selectors.getPlayers)

    while (!(yield select(selectors.isGameOver))) {
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
    if (GAME_MODE === SINGLE_PLAYER) {
        //Moves are numbers 0-3 representing the index of the pad
        let nextMove = Math.floor(Math.random() * 4)
        yield put(actions.addNextMove(nextMove))
    } else {
        let { payload } = yield take(actions.simonPadClicked)
        let pad = { pad: payload, isValid: true }

        yield fork(animateSimonPad, pad)
        yield put({ type: "server/ANIMATE_SIMON_PAD", payload: pad })
        yield put({ type: "server/ADD_NEXT_MOVE", payload })
    }
}

export const startLongTimer = function* () {
    let timeTillPlayerTimesout = yield select(selectors.getTimer)

    while (timeTillPlayerTimesout > 0) {
        yield delay(1000)
        yield put(actions.decreaseTimer())
        timeTillPlayerTimesout--
    }

    yield put({ type: "PLAYER_TIMEDOUT"})
}

export const startShortTimer = function* () {
    let timeTillPlayerTimesout = TIMEOUT_TIME

    while (timeTillPlayerTimesout > 0) {
        yield delay(1000)
        timeTillPlayerTimesout--
    }

    yield put({ type: "PLAYER_TIMEDOUT" })
}

export const eliminatePlayer = function* (player) {

}

export const performPlayersTurnOnline = function* (player) {
    yield takeEvery(actions.simonPadClicked, pipeMovesToServer)
}
export const pipeMovesToServer = function* (action) {
    yield put({ type: "server/ANIMATE_SIMON_PAD", payload: action.payload })
}

export const performPlayersTurn = function* (player) {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0

    while (movesPerformed < movesToPerform.length) {
        console.log("WAITING FOR YOU TO MAKE A MOVE")
        let isPlayersFirstMove = movesPerformed === 0
        let timer

        if (isPlayersFirstMove) {
            timer = yield fork(startLongTimer)
        } else {
            timer = yield fork(startShortTimer)
        }

        const { playersMove, timedout } = yield race({
            playersMove: take(actions.simonPadClicked),
            timedout: take("PLAYER_TIMEDOUT")
        })

        console.log("MOVE:", playersMove, timedout)
        if (timedout) {
            yield put(actions.eliminatePlayer(player))

            break
        } else {
            yield cancel(timer)
        }

        const isValidMove = playersMove.payload === movesToPerform[movesPerformed]
        const pad = { pad: playersMove.payload, isValid: isValidMove }

        yield fork(animateSimonPad, pad)
        
        if (!isValidMove) {
            yield put(actions.eliminatePlayer(player))

            break
        }

        movesPerformed++
    }

    //Give a little pause before starting the next turn
    yield delay(500)
}

export const savePlayersStats = function* () {
    
}

export const endTurn = function* () {
    console.log("ENDING THE GAME")

    const players = yield select(selectors.getPlayers)
    const performingPlayer = yield select(selectors.selectPerformingPlayer)

    console.log("players:", players, performingPlayer)
    //This line should be a selector
    const playersStillPlaying = players.filter(player => player.isEliminated === false)

    console.log("PLAYERS STILL PLAYING:", playersStillPlaying)

    //if its a single player game then the length should be 0.
    //if its a multiplayer game then the length should be 1.
    if (GAME_MODE === SINGLE_PLAYER) {
        if (playersStillPlaying.length === 0) {
            yield put(actions.gameOver())
        } else {
            console.log("PASSED THE ROUND :D")
            yield put(actions.resetTimer())
            yield put(actions.increaseRoundCounter())
        }
    } else if (GAME_MODE === MULTIPLAYER_GAME) {
        if (playersStillPlaying.length === 1) {
            yield put(actions.setWinner(playersStillPlaying[0]))
            yield put(actions.gameOver())
        } else {
            let currentPlayersIndex = players.indexOf(performingPlayer)
            let counter = 1
            let nextPlayerToPerform = players[(currentPlayersIndex + counter) % players.length]

            while (nextPlayerToPerform.isEliminated) {
                console.log("IM LOOPING")
                counter++
                nextPlayerToPerform = players[(currentPlayersIndex + counter) % players.length]
            }

            console.log("PASSED THE ROUND :D")
            yield put(actions.setPerformingPlayer(nextPlayerToPerform))
            yield put(actions.resetTimer())
            yield put(actions.increaseRoundCounter())
        }
    }
    
}

export const animateSimonPad = function* ({ pad, isValid }) {
    console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad({ pad, isValid }))
    yield call(delay, ANIMATION_DURATION)
    yield put(actions.animateSimonPad({ pad, isValid }))
}


export default root
