import { call, put, take, takeEvery } from "redux-saga/effects"
import { actions } from "./index"

const root = function* () {
    yield [
        watchGamePadClick()
    ]
}

const watchGamePadClick = function* () {
    console.log("Watching for game pad clicks")
    takeEvery(actions.simonPadClicked, handleGamePadClick)
}

const handleGamePadClick = function* (action) {
    let { pad } = action.payload

    yield animateSimonPad(pad)
}

const animateSimonPad = function* (pad) {
    console.log("Animating Simon Pad!!:", pad)
    yield put(actions.animateSimonPad(pad))
}

export default root
