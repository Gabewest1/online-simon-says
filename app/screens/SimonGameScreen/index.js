import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"

import SimonGame from "../../components/simon__game"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

const Container = styled.View`
    height: 100%;
    justify-content: center;
    align-items: center;
`
const TintedBG = styled.View`
    width: 100%;
    height: 100%;
    backgroundColor: rgba(0,0,0,.5);
    position: absolute;
    ${({ show }) => {
        if (show) {
            return `
                opacity: 1;
            `
        } else {
            return `
                z-index: -1;
                opacity: 0;
            `
        }
    }}
`
const Timer = styled.Text`
    width: 100%;
    text-align: center;
    color: black;
`
class SimonGameScreen extends React.Component {
    componentDidMount() {
        this.props.addPlayer({
            id: 0,
            name: "Gabe W.",
            isEliminated: false,
            isMyTurn: false
        })

        this.props.startGame(this.props.gameMode)
    }
    handlePadClick(pad) {
        console.log("PAD CLICKED", pad)
        this.props.simonPadClicked(pad)
    }
    renderGame() {
        return (
            <Container>
                <Timer>{ this.props.timer }</Timer>
                <SimonGame { ...this.props } onPress={ this.handlePadClick.bind(this) } />
                <TintedBG show={ this.props.isDisplayingMoves } />
            </Container>
        )
    }
    renderGameOver() {
        console.log("RENDERING THE GAME OVER SCREEN")
        this.props.navigator.push({
            screen: "SinglePlayerGameOverScreen", // unique ID registered with Navigation.registerScreen
            title: "Game Over", // title of the screen as appears in the nav bar (optional)
            passProps: {}, // simple serializable object that will pass as props to the modal (optional)
            navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
            animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        })
    }
    render() {
        //rendering the game over screen requires the regular game screen to be 
        //rendered first. Then the game over screen can be pushed onto the screen.
        if (this.props.isGameOver) {
            setTimeout(() => this.renderGameOver(), 1)
        }

        return this.renderGame()
    }
}

function mapStateToProps(state) {
    return {
        pads: simonGameSelectors.getPads(state),
        isDisplayingMoves: simonGameSelectors.isDisplayingMoves(state),
        isGameOver: simonGameSelectors.isGameOver(state),
        round: simonGameSelectors.getCurrentRound(state),
        timer: simonGameSelectors.getTimer(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions }, dispatch)
}

SimonGameScreen.propTypes = {
    gameMode: PropTypes.number.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    pads: PropTypes.array.isRequired,
    round: PropTypes.number.isRequired,
    isDisplayingMoves: PropTypes.bool.isRequired,
    timer: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SimonGameScreen)
