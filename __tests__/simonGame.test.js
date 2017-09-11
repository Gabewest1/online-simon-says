import React from "react"
import sinon from "sinon"
import sagaHelper from "redux-saga-testing"
import { shallow } from "enzyme"
import { expect } from "chai"
import { Reducer } from 'redux-testkit';
import { take } from "redux-saga/effects"
import SimonGame from "../app/components/simon__game"
import SimonPad from "../app/components/simon__pad"
import { actions, default as reducer } from "../app/redux/SimonSaysGame"
import {
    watchGamePadClick,
    handleGamePadClick,
    animateSimonPad
} from "../app/redux/SimonSaysGame/sagas"

/*
    Tests for the components
*/
describe("<SimonGame />", () => {
    let requiredProps = {
        onPress: () => {}
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
        const wrapper = shallow(<SimonGame onPress={ onButtonClick } />)
        wrapper.find(SimonPad).forEach(pad => pad.simulate("press"))
        expect(onButtonClick.callCount).to.equal(4)
    })
})

/*
    Tests for the reducer
*/
describe("Simon says reducers", () => {
    let padsReducer = reducer.pads
    let gameReducer = reducer.game
    let movesReducer = reducer.moves
    let playersReducer = reducer.players

    describe("game reducer", () => {
        const initialState = {
            round: 0,
            isGameOver: false,
            winner: undefined,
        }
        it("should return initial state", () => {
            Reducer(gameReducer).expect({}).toReturnState(initialState)
        })
    })

    describe("moves reducer", () => {
        const initialState = {
            moves: [],
            moveCounter: 0
        }

        it("should return initial state", () => {
            Reducer(movesReducer).expect({}).toReturnState(initialState)
        })
        
        it("should add a new move", () => {
            let newState = { ...initialState, moves: [ ...initialState.moves, "0"] }
            Reducer(movesReducer).expect(actions.addNextMove("0")).toReturnState(newState)
        })

        it("should retain all previous moves when adding a new move", () => {
            let state = { ...initialState, moves: ["2", "3", "0", "1", "2", "1"]}
            let newState = { ...state, moves: [ ...state.moves, "3"] }
            Reducer(movesReducer).withState(state).expect(actions.addNextMove("3")).toReturnState(newState)
        })

        it("should increase the moveToPerform counter when a move is successfully validated", () => {
            let newState = { ...initialState, moveCounter: initialState.moveCounter + 1 }
            Reducer(movesReducer).expect(actions.increaseMoveCounter()).toReturnState(newState)
        })

        it("should reset moveToPerform when turn is over", () => {
            let newState = { ...initialState, moveCounter: 0 }
            Reducer(movesReducer).withState({ ...initialState, moveCounter: 33 }).expect(actions.resetMoveCounter()).toReturnState(newState)
        })
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
            const nextState = pad => ({
                ...initialState,
                [pad]: {
                    isAnimating: true,
                    isValid: true
                }
            })
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
            const nextState = pad => ({
                ...initialState,
                [pad]: {
                    isAnimating: true,
                    isValid: false
                }
            })
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
describe("Simon says game sagas", () => {
    describe("watch game pad click saga", () => {
        const it = sagaHelper(watchGamePadClick())

        it("should capture game pad click events", result => {
            expect(result).to.deep.equal(take(actions.simonPadClicked))
            return "Hello"
        })
        
        it("should validate if the move was correct or incorrect", result => {
            console.dir(result)
            expect(result).to.equal(22)
            return "World"
        })

        it("should animate the simon pad", result => {
            console.dir(result)
            
        })
    })
})
