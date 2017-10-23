import { delay } from "redux-saga"
import { all, call, cancel, fork, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects"
import { actions, selectors } from "./index"
import { actions as navigatorActions } from "../Navigator"

export const ANIMATION_DURATION = 100
export const TIMEOUT_TIME = 3
const MULTIPLAYER_GAME = 0
const SINGLE_PLAYER = 1

let GAME_MODE
let ScreenNavigator

const root = function* () {
    yield [
        cancelPrivateMatch(),
        watchSimonGameSaga(),
        watchFindMatch(),
        watchAnimateSimonPadOnline(),
        getNavigator(),
        playerDisconnected(),
        createPrivateMatchSaga(),
        invitePlayerSaga(),
        receiveGameInviteSaga(),
        playerQuitMatchSaga()
    ]
}
export const getNavigator = function* () {
    const action = yield take("GIVE_SAGAS_NAVIGATOR")
    ScreenNavigator = action.payload
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

        const { cancelSearch, foundMatch } = yield race({
            cancelSearch: take(actions.cancelSearch),
            foundMatch: take(actions.foundMatch)
        })

        //I'm passing in the gameMode as a payload even though on the server my
        //GameRoomManager doesn't use a gameMode to cancel a search. But, passing
        //in the gameMode could be used a performance boost for finding the players
        //game room and canceling their search.
        if (cancelSearch) {
            yield put({ type: "server/CANCEL_SEARCH", payload: gameMode })
        } else {
            ScreenNavigator.push({
                screen: "SimonGameScreen",
                title: "",
                animated: true,
                animationType: 'slide-horizontal',
                passProps: { gameMode },
                overrideBackPress: true,
                backButtonHidden: true
            })
        }

    }
}

export const watchSimonGameSaga = function* () {
    while (true) {
        const task = yield takeLatest(actions.startGame, simonGameSaga)
        yield take(actions.cancelSimonGameSaga)
        yield cancel(task)
    }
}

export const simonGameSaga = function* (action) {
    const gameMode = action.payload

    if (gameMode === 1) {
        GAME_MODE = SINGLE_PLAYER
        yield call(singlePlayerGameSaga)
    } else {
        GAME_MODE = MULTIPLAYER_GAME
        yield call(multiplayerGameSaga, gameMode)
    }

}

export const multiplayerGameSaga = function* (gameMode) {
    yield put({ type: "server/PLAYER_READY_TO_START" })
    yield takeEvery("PERFORM_YOUR_TURN", performTurnSaga)
    yield take("GAME_OVER")
    
    const winner = yield select(selectors.getWinner)

    ScreenNavigator.resetTo({
        screen: "GameOverScreen",
        title: "Game Over",
        passProps: { gameMode, winner },
        animationType: 'slide-up',
        overrideBackPress: true,
        backButtonHidden: true
    })
}

export const performTurnSaga = function* () {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0

    while (movesPerformed <= movesToPerform.length) {
        console.log("WAITING FOR A MOVE")

        const { playersMove, timedout } = yield race({
            playersMove: take(actions.simonPadClicked),
            timedout: take("PLAYER_TIMEDOUT")
        })

        if (timedout) {
            break
        }

        const isValidMove =
            movesPerformed === movesToPerform.length ||
            playersMove.payload === movesToPerform[movesPerformed]

        const pad = { pad: playersMove.payload, isValid: isValidMove }
        console.log("PLAYER PRESSED PAD:", pad)
        yield fork(animateSimonPad, pad)
        yield put({ type: "server/ANIMATE_SIMON_PAD", payload: pad })

        if (!isValidMove) {
            break
        }

        movesPerformed++
    }    
}

export const playerDisconnected = function* () {
    while (true) {
        const action = yield take("PLAYER_DISCONNECTED")

        console.log("HHHEEEEEYYYYYY IM DISCONNECTION SOMEBODY")
        ScreenNavigator.showInAppNotification({
            screen: "PlayerDisconnectedMessage",
            passProps: { player: action.payload },
            autoDismissTimerSec: 3
        })
    }
}

export const singlePlayerGameSaga = function* () {
    const [ playerPerforming ] = yield select(selectors.getPlayers)

    while (!(yield select(selectors.isGameOver))) {
        yield call(setNextMove)
        yield call(displayMovesToPerform)
        const didPlayerPassTurn = yield call(performPlayersTurn, playerPerforming)
        yield call(endTurn, didPlayerPassTurn)
    }

    ScreenNavigator.push({
        screen: "GameOverScreen",
        title: "Game Over",
        passProps: { gameMode: SINGLE_PLAYER },
        animationType: 'slide-up',
        overrideBackPress: true,
        backButtonHidden: true
    })
}

export const displayMovesToPerform = function* () {
    let movesToPerform = yield select(selectors.getMoves)
    yield put(actions.setIsScreenDarkened(true))
    yield call(delay, 1000)

    for (let move of movesToPerform) {
        yield call(animateSimonPad, { pad: move, isValid: true })
        yield call(delay, 500) //Wait half a second between each move
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

export const performPlayersTurn = function* (player) {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0

    while (movesPerformed < movesToPerform.length) {
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

        if (timedout) {
            return false
        } else {
            yield cancel(timer)
        }

        const isValidMove = playersMove.payload === movesToPerform[movesPerformed]

        if (!isValidMove) {
            return false
        }

        movesPerformed++
    }

    //Give a little pause before starting the next turn
    yield delay(500)

    return true
}

export const endTurn = function* (didPlayerPassTurn) {
    if (didPlayerPassTurn) {
        console.log("PASSED THE ROUND :D")
        yield put(actions.resetTimer())
        yield put(actions.increaseRoundCounter())
    } else {
        yield put(actions.gameOver())
    }
}

export const animateSimonPad = function* ({ pad, isValid }) {
    console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad({ pad, isValid }))
    yield call(delay, ANIMATION_DURATION)
    yield put(actions.animateSimonPad({ pad, isValid }))
}

export const createPrivateMatchSaga = function* () {
    while (true) {
        yield take(actions.createPrivateMatch)
        yield put({ type: "server/CREATE_PRIVATE_MATCH" })
        yield take("PRIVATE_MATCH_CREATED")

        ScreenNavigator.push({
            screen: "InvitePlayersScreen",
            title: "",
            animationType: 'slide-up',
            overrideBackPress: true
        })
    }
}

export const cancelPrivateMatch = function* () {
    while (true) {
        yield take(actions.cancelPrivateMatch)
        yield put({ type: "server/CANCEL_PRIVATE_MATCH" })
    }
}

export const invitePlayerSaga = function* () {
    while (true) {
        const action = yield take(actions.invitePlayer)

        yield put({ type: "server/INVITE_PLAYER", payload: action.payload })
    }
}

export const receiveGameInviteSaga = function* () {
    while (true) {
        const action = yield take("RECEIVE_INVITE")
        const { player, gameRoom } = action.payload

        ScreenNavigator.showInAppNotification({
            screen: "GameInvitationNotification",
            passProps: { player },
            autoDismissTimerSec: 7
        })

        const { playerAccepted } = yield race({
            playerAccepted: take(actions.playerAcceptedChallenge),
            playerDeclined: take(actions.playerDeclinedChallenge),
            playerDidntRespond: call(delay, 7000)
        })

        if (playerAccepted) {
            yield put({ type: "server/JOIN_PRIVATE_MATCH", payload: { gameRoom } })
            yield take("JOINED_PRIVATE_MATCH")
            ScreenNavigator.push({
                screen: "InvitePlayersScreen",
                title: "",
                animationType: 'slide-up',
                overrideBackPress: true,
            })
        }
    }
}

export const playerQuitMatchSaga = function* () {
    while (true) {
        yield take(actions.playerQuitMatch)

        if (GAME_MODE === SINGLE_PLAYER) {
            yield call(updateStats)
        } else {
            yield put({ type: "server/PLAYER_QUIT_MATCH" })
        }

        yield put(actions.resetGame())
        yield put(actions.cancelSimonGameSaga())
    }
}

export const updateStats = function* () {

}

export default root
