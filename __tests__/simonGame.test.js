import React from "react"
import sinon from "sinon"
import { expectSaga, testSaga } from "redux-saga-test-plan"
import * as matchers from 'redux-saga-test-plan/matchers'
import { delay } from "redux-saga"
import { call, race, select, take } from "redux-saga/effects"
import { shallow } from "enzyme"
import { expect } from "chai"
import { Reducer } from 'redux-testkit';
import SimonGame from "../app/components/simon__game"
import SimonPad from "../app/components/simon__pad"
import { actions, selectors } from "../app/redux/SimonSaysGame"
import { gameReducer, movesReducer, playersReducer, padsReducer } from "../app/redux/SimonSaysGame/reducer"
import {
    ANIMATION_DURATION,
    animateSimonPad,
    endTurn,
    displayMovesToPerform,
    performPlayersTurn,
    setNextMove
} from "../app/redux/SimonSaysGame/sagas"

/*
    Tests for the components
*/
describe("<SimonGame />", () => {
    let isAnimating = true
    let requiredProps = {
        onPress: () => {},
        pads: [{ isAnimating }, { isAnimating }, { isAnimating }, { isAnimating }]
    }
    it("should render", () => {
        const wrapper = shallow(<SimonGame { ...requiredProps } />)
        expect(wrapper.instance()).to.equal(wrapper.instance())
    })

    it("should contain 4 <SimonPad /> components", () => {
        const wrapper = shallow(<SimonGame { ...requiredProps } />)
        expect(wrapper.find(SimonPad)).to.have.length(4)
    })

    it("should pass down click events to <SimonPad /> components", () => {
        const onButtonClick = sinon.spy()
        const wrapper = shallow(<SimonGame { ...requiredProps } onPress={ onButtonClick } />)
        wrapper.find(SimonPad).forEach(pad => pad.simulate("press"))
        expect(onButtonClick.callCount).to.equal(4)
    })
})

/*
    Tests for the reducer
*/
describe("Simon says reducers", () => {

    describe("game reducer", () => {
        const initialState = {
            hasFoundMatch: false,
            round: 0,
            isGameOver: false,
            winner: undefined
        }
        it("should return initial state", () => {
            Reducer(gameReducer).expect({}).toReturnState(initialState)
        })
    })

    describe("moves reducer", () => {
        const initialState = []

        it("should return initial state", () => {
            Reducer(movesReducer).expect({}).toReturnState(initialState)
        })

        it("should add a new move", () => {
            let newState = ["0"]
            Reducer(movesReducer).expect(actions.addNextMove("0")).toReturnState(newState)
        })

        it("should retain all previous moves when adding a new move", () => {
            let initialState = ["2", "3", "0", "1", "2", "1"]
            let newState = [ ...initialState, "3"]
            Reducer(movesReducer).withState(initialState).expect(actions.addNextMove("3")).toReturnState(newState)
        })

        /*
            These 2 tests were relavent when I kept the moves reducer state as an object
            with a moveToPerform property. Now the moves reducer is only an array that
            tracks which moves should be performed and doesnt care about the moveToPerform
        */
        // it("should increase the moveToPerform counter when a move is successfully validated", () => {
        //     let newState = initialState.moveCounter + 1 }
        //     Reducer(movesReducer).expect(actions.increaseMoveCounter()).toReturnState(newState)
        // })

        // it("should reset moveToPerform when turn is over", () => {
        //     let newState = 0 }
        //     Reducer(movesReducer).withState({ ...initialState, moveCounter: 33 }).expect(actions.resetMoveCounter()).toReturnState(newState)
        // })
    })

    describe("players reducer", () => {
        const initialState = []
        let player1
        let player2

        beforeEach(() => {
            player1 = {
                id: 0,
                name: "Gabe W.",
                isEliminated: false,
                isMyTurn: false
            }
            player2 = {
                id: 0,
                name: "Simon S.",
                isEliminated: false,
                isMyTurn: true
            }
        })

        it("should return initial state", () => {
            Reducer(playersReducer).expect({}).toReturnState(initialState)
        })

        it("should add a player", () => {
            let nextState = [player1]
            Reducer(playersReducer).expect(actions.addPlayer(player1)).toReturnState(nextState)
        })

        it("should remove a player", () => {
            let currentState = [player1, player2]
            let nextState = [player2]
            Reducer(playersReducer)
                .withState(currentState)
                .expect(actions.removePlayer(player1))
                .toReturnState(nextState)
        })

        it("should eliminate a player", () => {
            let currentState = [player1]
            let nextState = [{ ...player1, isEliminated: true }]
            Reducer(playersReducer)
                .withState(currentState)
                .expect(actions.eliminatePlayer(player1))
                .toReturnState(nextState)
        })

        it("should set a players isMyTurn flag to true", () => {
            let currentState = [player1]
            let nextState = [{ ...player1, isMyTurn: true }]
            Reducer(playersReducer)
                .withState(currentState)
                .expect(actions.setPlayersTurn(player1))
                .toReturnState(nextState)
        })

        it("should set a players isMyTurn flag to false", () => {
            let currentState = [player1, player2]
            let nextState = [{ ...player1, isMyTurn: true }, { ...player2, isMyTurn: false }]
            Reducer(playersReducer)
                .withState(currentState)
                .expect(actions.setPlayersTurn(player1))
                .toReturnState(nextState)
        })
    })
    describe("pads reducer", () => {
        const initialState = [
            { isAnimating: false, isValid: undefined },
            { isAnimating: false, isValid: undefined },
            { isAnimating: false, isValid: undefined },
            { isAnimating: false, isValid: undefined }
        ]

        it("should return initial state", () => {
            Reducer(padsReducer).expect({}).toReturnState(initialState)
        })

        it("should animate the pads successfully", () => {
            const nextState = pad => {
                return initialState.map((p, i) => {
                    return i == pad
                        ? { ...p, isAnimating: true, isValid: true }
                        : { ...p, isAnimating: false, isValid: undefined}
                })
            }

            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "0", isValid: true}))
                .toReturnState(nextState("0"))
            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "1", isValid: true}))
                .toReturnState(nextState("1"))
            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "2", isValid: true}))
                .toReturnState(nextState("2"))
            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "3", isValid: true}))
                .toReturnState(nextState("3"))
        })

        it("should animate the pads unsuccessfully", () => {
            const nextState = pad => {
                return initialState.map((p, i) => {
                    return i == pad
                        ? { ...p, isAnimating: true, isValid: false }
                        : { ...p, isAnimating: false, isValid: undefined}
                })
            }

            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "0", isValid: false}))
                .toReturnState(nextState("0"))
            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "1", isValid: false}))
                .toReturnState(nextState("1"))
            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "2", isValid: false}))
                .toReturnState(nextState("2"))
            Reducer(padsReducer)
                .expect(actions.animateSimonPad({pad: "3", isValid: false}))
                .toReturnState(nextState("3"))
        })
    })
})

/*
    Tests for the sagas
*/
describe("Single player game flow", () => {

    it("should add a new move to the array of moves to perform", () => {
        testSaga(setNextMove)
            .next()
            .inspect(effect => {
                expect(effect.PUT.action.payload).to.be.oneOf([0, 1, 2, 3])
            })
    })

    it("should animate the pads that the player needs to press before their turn", () => {
        testSaga(displayMovesToPerform)
            .next()

            .select(selectors.getMoves)
            .next([0, 1, 2, 3])
            
            .call(delay, 1000)

            .next().call(animateSimonPad, { pad: 0, isValid: true })
            .next().call(delay, 500)
            
            .next().call(animateSimonPad, { pad: 1, isValid: true })
            .next().call(delay, 500)

            .next().call(animateSimonPad, { pad: 2, isValid: true })
            .next().call(delay, 500)

            .next().call(animateSimonPad, { pad: 3, isValid: true })
            .next().call(delay, 500)
    })

    describe("should perform a players turn", () => {

        let movesToPerform
        let player1
        let player2

        beforeEach(() => {
            movesToPerform = [0, 1, 3, 2]
            player1 = {
                id: 0,
                name: "Gabe W.",
                isEliminated: false,
                isMyTurn: false
            }
            player2 = {
                id: 0,
                name: "Simon S.",
                isEliminated: false,
                isMyTurn: true
            }
        })
        it("Case #1: player performs all moves correctly", () => {
            testSaga(performPlayersTurn, player1)
                .next()

                .select(selectors.getMoves)
                .next(movesToPerform)

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(0)})

                .fork(animateSimonPad, { pad: 0, isValid: true })
                .next()

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(1)})

                .fork(animateSimonPad, { pad: 1, isValid: true })
                .next()

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(3)})

                .fork(animateSimonPad, { pad: 3, isValid: true })
                .next()

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(2)})

                .fork(animateSimonPad, { pad: 2, isValid: true })
        })

        it("Case #2: player performs first move wrong and is eliminated", () => {
            testSaga(performPlayersTurn, player1)
                .next()

                .select(selectors.getMoves)
                .next(movesToPerform)

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(1)})

                .put(actions.eliminatePlayer(player1))
        })

        it("Case #3: player performs some moves correctly then fails", () => {
            testSaga(performPlayersTurn, player1)
                .next()

                .select(selectors.getMoves)
                .next(movesToPerform)

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(0)})

                .fork(animateSimonPad, { pad: 0, isValid: true })
                .next()

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(1)})

                .fork(animateSimonPad, { pad: 1, isValid: true })
                .next()

                .race({
                    playersMove: take(actions.simonPadClicked),
                    timedout: call(delay, 1000)
                })
                .next({ playersMove: actions.simonPadClicked(0)})

                .put(actions.eliminatePlayer(player1))
        })

        it("Case #4: player does nothing and timesout", () => {
            return expectSaga(performPlayersTurn, player1)
                .provide([
                    [select(selectors.getMoves), movesToPerform],
                    [race({
                        playersMove: take(actions.simonPadClicked),
                        timedout: call(delay, 1000)
                    }), { timedout: true }]
                ])
                .put(actions.eliminatePlayer(player1))
                .run()
        })

        it("Case #5: player performs some moves then does nothing and timesout", () => {
            return expectSaga(performPlayersTurn, player1)
                .provide([
                    [select(selectors.getMoves), movesToPerform],
                    [race({
                        playersMove: take(actions.simonPadClicked),
                        timedout: call(delay, 1000)
                    }), { playersMove: { payload: 0 } }],
                    [race({
                        playersMove: take(actions.simonPadClicked),
                        timedout: call(delay, 1000)
                    }), { timedout: true }]
                ])
                .dispatch(actions.simonPadClicked(0))
                .fork(animateSimonPad, { pad: 0, isValid: true })
                .put(actions.eliminatePlayer(player1))
                .run()
        })
    })

    describe("after a player performs their turn", () => {
        describe("if the player has lost", () => {
            it("should save the players stats into local storage and to the database", () => {

            })

            it("should display a screen asking the player to restart or quit", () => {

            })
        })

        describe("if the player performed their turn correctly", () => {
            it("should increase the round counter", () => {
                testSaga(endTurn)
                    .next()
                    
                    .select(selectors.getPlayers)
                    .next([{ isEliminated: false }])

                    .put(actions.increaseRoundCounter())
            })
        })

    })
})

describe("multiplayer game flow", () => {

})