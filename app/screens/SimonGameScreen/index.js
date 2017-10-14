import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"

import SimonGame from "../../components/simon__game"
import Background from "../../components/background"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

import { SINGLE_PLAYER_GAME, BACKGROUND_COLOR } from "../../constants"

const Container = styled(Background)`
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
const PlayersView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 15px;
    position: absolute;
    top: 0;
    width: 100%;
`
const Player = styled.Text`
    backgroundColor: ${({ isItMyTurn }) => isItMyTurn ? "gold" : "white"};
    borderRadius: 330px;
    padding: 7.5px 10px;
`
const Timer = styled.Text`
    width: 100%;
    text-align: center;
    color: black;
`
const Players = ({ player1, player2, performingPlayer }) => {
    return (
        <PlayersView>
            <Player isItMyTurn={ performingPlayer.username === player1.username }>{ player1.username }</Player>
            <Player isItMyTurn={ performingPlayer.username === player2.username }>{ player2.username }</Player>
        </PlayersView>
    )
}
class SimonGameScreen extends React.Component {
    componentWillMount() {
        this.props.startGame(this.props.gameMode)
    }
    handlePadClick(pad) {
        console.log("PAD CLICKED", pad)
        this.props.simonPadClicked(pad)
        // if (this.props.gameMode === SINGLE_PLAYER_GAME) {
        //     console.log("I GOT CLICKED")
        //     this.props.animateSimonPad({ pad, isValid: true })
        //     setTimeout(() => {
        //         this.props.animateSimonPad({ pad, isValid: true })
        //     }, 50)
        // } else {
        //     this.props.simonPadClicked(pad)
        // }
    }

    render() {
        return (
            <Container>
                <TintedBG show={ this.props.isScreenDarkened } />
                { this.gameMode === SINGLE_PLAYER_GAME &&
                    <Players performingPlayer={ this.props.performingPlayer } player1={ this.props.players[0] } player2={ this.props.players[1]} />
                }
                <Timer>{ this.props.timer }</Timer>
                <SimonGame { ...this.props } onPressIn={ this.handlePadClick.bind(this) } />
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        hasGameStarted: simonGameSelectors.hasGameStarted(state),
        isGameOver: simonGameSelectors.isGameOver(state),
        isItMyTurn: simonGameSelectors.isItMyTurn(state),
        isScreenDarkened: simonGameSelectors.isScreenDarkened(state),
        pads: simonGameSelectors.getPads(state),
        performingPlayer: simonGameSelectors.selectPerformingPlayer(state),
        players: simonGameSelectors.getPlayers(state),
        round: simonGameSelectors.getCurrentRound(state),
        timer: simonGameSelectors.getTimer(state),
        winner: simonGameSelectors.getWinner(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions }, dispatch)
}

SimonGameScreen.propTypes = {
    hasGameStarted: PropTypes.bool.isRequired,
    gameMode: PropTypes.number.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    round: PropTypes.number.isRequired,
    isScreenDarkened: PropTypes.bool.isRequired,
    timer: PropTypes.number.isRequired,
    pads: PropTypes.array.isRequired,
    performingPlayer: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    isItMyTurn: PropTypes.bool.isRequired,
    simonPadClicked: PropTypes.func.isRequired,
    animateSimonPad: PropTypes.func.isRequired,
    winner: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(SimonGameScreen)
