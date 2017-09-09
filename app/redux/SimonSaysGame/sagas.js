import { takeEvery } from "redux-saga"
import { call, put, take } from "redux-saga/effects"
import { actions } from "./index"

const root = function* () {
    yield [
        watchGamePadClick()
    ]
}

export const watchGamePadClick = function* () {
    yield* takeEvery(actions.simonPadClicked, handleGamePadClick)
}

export const handleGamePadClick = function* (action) {
    let { pad } = action.payload

    yield animateSimonPad(pad)
}

export const animateSimonPad = function* (pad) {
    console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad(pad))
}

export default root
