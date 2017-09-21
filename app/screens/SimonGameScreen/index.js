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
class SimonGameScreen extends React.Component {
    componentDidMount() {
        this.props.addPlayer({
            id: 0,
            name: "Gabe W.",
            isEliminated: false,
            isMyTurn: false
        })
        this.props.startGame()
    }
    handlePadClick = (pad) => {
        console.log("PAD CLICKED", pad)
        this.props.simonPadClicked(pad)
    }
    renderGame() {
        return (
            <Container>
                <SimonGame { ...this.props } onPress={ this.handlePadClick } />
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
          });
    }
    render() {
        if (this.props.isGameOver) {
            setTimeout(() => this.renderGameOver(), 1)
        }

        return this.renderGame()
    }
}

function mapStateToProps(state) {
    return {
        pads: simonGameSelectors.getPads(state),
        isGameOver: simonGameSelectors.isGameOver(state),
        round: simonGameSelectors.getCurrentRound(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions }, dispatch)
}

SimonGameScreen.propTypes = {
    pads: PropTypes.array.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    round: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SimonGameScreen)
