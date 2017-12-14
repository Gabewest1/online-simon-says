import { delay } from "redux-saga"
import { all, call, cancel, fork, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects"
import { AsyncStorage } from "react-native"
import { actions, selectors } from "./index"
import { selectors as userSelectors } from "../Auth"

import { actions as navigatorActions } from "../Navigator"

export const ANIMATION_DURATION = 450
export const TIMEOUT_TIME = 7
const MULTIPLAYER_GAME = 0
const SINGLE_PLAYER = 1

let GAME_MODE

const root = function* () {
    yield [
        cancelPrivateMatch(),
        watchSimonGameSaga(),
        findMatchSaga(),
        playerDisconnected(),
        createPrivateMatchSaga(),
        invitePlayerSaga(),
        receiveGameInviteSaga(),
        playerQuitMatchSaga(),
        playerReadySaga(),
        playerNotReadySaga(),
        gotoGameScreenSaga()
    ]
}

export const listenForOpponentsMoveSaga = function* () {
    const numberOfMoves = yield select(selectors.numberOfMoves)

    let movesQueue = [] //Opponents moves to be displayed that come from the server
    let movesPerformed = 0
    let didPerformingPlayerFail = false

    const isTurnOver = () => movesPerformed >= numberOfMoves || didPerformingPlayerFail
    const opponentTimedout = function* () { didPerformingPlayerFail = true }
    const queueOpponentsMove = function* ({ payload }) {
        if (didPerformingPlayerFail) {
            return
        }

        if (!payload.isValid) {
            didPerformingPlayerFail = true
        }

        movesQueue.push(payload.pad)
        movesPerformed++
    }
    const dequeueOpponentsMoves = function* () {
        let moveToPerform
        while ((moveToPerform = movesQueue.shift())) {
            yield call(animateSimonPad, { payload: moveToPerform })
            yield delay(ANIMATION_DURATION)
        }
    }

    const listenForOpponentsMovesTask = yield takeEvery("ANIMATE_SIMON_PAD_ONLINE", queueOpponentsMove)
    const listenForOpponentTimeoutTask = yield takeLatest("PLAYER_TIMEDOUT", opponentTimedout)

    while (!isTurnOver()) {
        if (movesQueue.length === 0) {
            console.log("WAITING FOR ANIMATE_SIMON_PAD_ONLINE")
            yield delay(500)
        }

        yield call(dequeueOpponentsMoves)
    }

    if (movesQueue.length > 0) {
        console.log(`LETS DEQUE THE REMAINING ${movesQueue.length} MOVES!!!!`)
        yield call(dequeueOpponentsMoves)
    }

    yield cancel(listenForOpponentsMovesTask)
    yield cancel(listenForOpponentTimeoutTask)
}

export const findMatchSaga = function* () {
    while (true) {
        const { payload: gameMode } = yield take(actions.findMatch)

        yield put({ type: "server/FIND_MATCH", gameMode })

        const { cancelSearch, foundMatch, playerJoinedPrivateMatch } = yield race({
            cancelSearch: take(actions.cancelSearch),
            foundMatch: take(actions.foundMatch),
            playerJoinedPrivateMatch: take(actions.playerAcceptedChallenge)
        })

        
        if (cancelSearch || playerJoinedPrivateMatch) {
            yield put({ type: "server/CANCEL_SEARCH" })
        } else {
            const navigationOptions = {
                screen: "SimonGameScreen",
                title: "",
                animated: true,
                animationType: 'slide-horizontal',
                overrideBackPress: true
            }
            const payload = { fn: "push", navigationOptions }

            yield delay(3000)
            yield put(navigatorActions.navigateToScreen(payload))
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

    //Client switches between performing their turn and listening to the turns
    //of their opponents. This continues utill a GAME_OVER is emiited.
    const startTurn = function* () {
        const { performYourTurn, listenForOpponentsMove } = yield race({
            performYourTurn: take("PERFORM_YOUR_TURN"),
            listenForOpponentsMove: take("LISTEN_FOR_OPPONENTS_MOVES")
        })

        if (performYourTurn) {
            yield call(performMultiplayerTurnSaga)
        } else if (listenForOpponentsMove) {
            yield call(listenForOpponentsMoveSaga)
        }

        yield put({ type: "server/READY_FOR_NEXT_TURN" }) //All players must alert the server to move on or be kicked
    }

    yield fork(startTurn)

    const turnTask = yield takeLatest("START_NEXT_TURN", startTurn)

    yield take("GAME_OVER")
    yield cancel(turnTask)

    const winner = yield select(selectors.getWinner)

    const navigationOptions = {
        screen: "GameOverScreen",
        title: "Game Over",
        passProps: { gameMode, winner },
        animationType: 'slide-up',
        overrideBackPress: true,
        backButtonHidden: true
    }

    const payload = { fn: "resetTo", navigationOptions}
    yield put(navigatorActions.navigateToScreen(payload))
}

export const performMultiplayerTurnSaga = function* () {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0
    yield put(actions.setMoveIndex(movesPerformed))

    while (movesPerformed <= movesToPerform.length) {
        yield put(actions.setIsScreenDarkened(false))

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

        yield put({ type: "server/ANIMATE_SIMON_PAD", payload: pad })

        if (!isValidMove) {
            break
        }

        movesPerformed++
        yield put(actions.setMoveIndex(movesPerformed))
    }

    yield put(actions.setIsScreenDarkened(true))
}

export const playerDisconnected = function* () {
    while (true) {
        const action = yield take("PLAYER_DISCONNECTED")

        console.log("HHHEEEEEYYYYYY IM DISCONNECTION SOMEBODY")
        const navigationOptions = {
            screen: "PlayerDisconnectedMessage",
            passProps: { player: action.payload },
            autoDismissTimerSec: 3,
            position: "bottom"
        }

        yield put(navigatorActions.showInAppNotification({
            fn: "showInAppNotification",
            navigationOptions
        }))
    }
}

export const singlePlayerGameSaga = function* () {

    while (!(yield select(selectors.isGameOver))) {
        yield call(setNextMove)
        yield call(displayMovesToPerform)
        const didPlayerPassTurn = yield call(performSinglePlayerTurnSaga)
        yield call(endTurn, didPlayerPassTurn)
    }

    yield call(updateSinglePlayerStats)

    const navigationOptions = {
        screen: "GameOverScreen",
        title: "Game Over",
        passProps: { gameMode: SINGLE_PLAYER },
        animationType: 'slide-up',
        overrideBackPress: true,
        backButtonHidden: true
    }

    const payload = { fn: "push", navigationOptions}
    yield put(navigatorActions.navigateToScreen(payload))
}

export const displayMovesToPerform = function* () {
    let movesToPerform = yield select(selectors.getMoves)
    yield put(actions.setIsScreenDarkened(true))
    yield call(delay, 1000)

    for (let move of movesToPerform) {
        yield call(animateSimonPad, { payload: move })
        yield call(delay, 200) //Wait between each move
    }

    yield put(actions.setIsScreenDarkened(false))
}

export const setNextMove = function* () {
    if (GAME_MODE === SINGLE_PLAYER) {
        //Moves are numbers 0-3 representing the index of the pad
        let nextMove = Math.floor(Math.random() * 4) + 1
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

export const performSinglePlayerTurnSaga = function* () {
    const movesToPerform = yield select(selectors.getMoves)
    let movesPerformed = 0

    while (movesPerformed < movesToPerform.length) {
        const correctMove = movesToPerform[movesPerformed]        
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
            yield put(actions.setWrongMove(0))
            yield put(actions.setCorrectMove(correctMove))

            return false
        } else {
            yield cancel(timer)
        }

        const isValidMove = playersMove.payload === correctMove

        if (!isValidMove) {
            yield put(actions.setWrongMove(playersMove.payload))
            yield put(actions.setCorrectMove(correctMove))

            return false
        }

        movesPerformed++
    }

    yield put(actions.setIsScreenDarkened(true))

    return true
}

export const endTurn = function* (didPlayerPassTurn) {
    if (didPlayerPassTurn) {
        // console.log("PASSED THE ROUND :D")
        yield put(actions.resetTimer())
        yield put(actions.increaseRoundCounter())
    } else {
        yield put(actions.gameOver())
    }
}

export const animateSimonPad = function* (action) {
    const pad = action.payload
    // console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad(pad))
    yield call(delay, ANIMATION_DURATION)
    yield put(actions.animateSimonPad(0))
}

export const createPrivateMatchSaga = function* () {
    while (true) {
        yield take(actions.createPrivateMatch)
        yield put({ type: "server/CREATE_PRIVATE_MATCH" })
        yield take("PRIVATE_MATCH_CREATED")

        const navigationOptions = {
            screen: "InvitePlayersScreen",
            title: "",
            animationType: 'slide-up',
            overrideBackPress: true
        }

        const payload = { fn: "push", navigationOptions}
        yield put(navigatorActions.navigateToScreen(payload))
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

        const navigationOptions = {
            screen: "GameInvitationNotification",
            passProps: { player },
            autoDismissTimerSec: 7,
            position: "bottom"
        }

        yield put(navigatorActions.showInAppNotification({
            fn: "showInAppNotification",
            navigationOptions
        }))

        const { playerAccepted } = yield race({
            playerAccepted: take(actions.playerAcceptedChallenge),
            playerDeclined: take(actions.playerDeclinedChallenge),
            playerDidntRespond: call(delay, 7000)
        })

        console.log("ACCEPTED THE CHALLENGE AND DISMISSING THE NOTIFICATION")
        yield put(navigatorActions.showInAppNotification({
            fn: "dismissInAppNotification",
            navigationOptions: {
                screen: "GameInvitationNotification"
            }
        }))

        console.log("THE NOTIFICATION HAS BEEN DISMISSED")
        if (playerAccepted) {
            console.log("ABOUT THE SEND THE SERVER A JOIN_PRIVATE_MATCH")
            yield put({ type: "server/JOIN_PRIVATE_MATCH", payload: { gameRoom } })
            console.log("WAITING FOR THE JOINED_PRIVATE_MATCH")
            yield take("JOINED_PRIVATE_MATCH")

            const navigationOptions = {
                screen: "InvitePlayersScreen",
                title: "",
                animationType: 'slide-up',
                overrideBackPress: true
            }

            const payload = { fn: "push", navigationOptions }

            yield put(navigatorActions.navigateToScreen(payload))
        }
    }
}

export const playerReadySaga = function* () {
    while (true) {
        yield take(actions.playerReady)
        yield put({ type: "server/PLAYER_READY" })
    }
}

export const playerNotReadySaga = function* () {
    while (true) {
        yield take(actions.playerNotReady)
        yield put({ type: "server/PLAYER_NOT_READY" })
    }
}

export const playerQuitMatchSaga = function* () {
    while (true) {
        yield take(actions.playerQuitMatch)

        if (GAME_MODE === SINGLE_PLAYER) {
            yield call(updateSinglePlayerStats)
        } else {
            yield put({ type: "server/PLAYER_QUIT_MATCH" })
        }

        yield put(actions.resetGame())
        yield put(actions.cancelSimonGameSaga())
    }
}

export const gotoGameScreenSaga = function* () {
    while (true) {
        const { payload: gameMode } = yield take("GO_TO_GAME_SCREEN")

        const navigationOptions = {
            screen: "SimonGameScreen",
            passProps: { gameMode },
            overrideBackPress: true
        }

        const payload = { fn: "push", navigationOptions }
        yield put(navigatorActions.navigateToScreen(payload))
    }
}
export const updateSinglePlayerStats = function* () {
    console.log("updateSinglePlayerStats called!")
    const playerPerforming = yield select(selectors.selectPerformingPlayer)
    const currentHighScore = yield call(getHighScore)
    const round = yield select(selectors.getCurrentRound)

    const highScore = Math.max(currentHighScore, round)

    if (playerPerforming.isAGuest && highScore > currentHighScore) {
        console.log("UPDATING STATS:", highScore, currentHighScore)
        const payload = {
            ...playerPerforming,
            statsByGameMode: {
                ...playerPerforming.statsByGameMode,
                1: { highScore }
            }
        }

        yield call(saveToLocalStorage, highScore)        
        yield put({ type: "UPDATE_STATS", payload })
    } else {
        yield put({ type: "server/UPDATE_SINGLE_PLAYER_STATS", payload: { round }})
    }
}

export const getHighScore = function* () {
    try {
        const localStorageHighScore = parseInt( (yield call(AsyncStorage.getItem, 'highscore')) ) || 0
        const currentHighScore = yield select(userSelectors.getHighScore)

        return Math.max(localStorageHighScore, currentHighScore)
    } catch (error) {
        console.log(error)
    }
}
export const saveToLocalStorage = function* (score) {
    console.log("SAVING HIGHSCORE:", score)
    try {
        yield call(AsyncStorage.setItem, "highscore", score.toString())
    } catch (err) {
        console.log(err)
    }
}

export default root
