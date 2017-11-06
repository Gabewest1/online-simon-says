import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"

import Player from "../../components/player"
import SimonGame from "../../components/simon__game"
import Background from "../../components/background"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

import { selectors as userSelectors } from "../../redux/Auth"

import {
    actions as navigatorActions
} from "../../redux/Navigator"

import { SINGLE_PLAYER_GAME, BACKGROUND_COLOR, SECONDARY_COLOR } from "../../constants"

const Container = styled(Background)`
    justify-content: center;
    align-items: center;
`
const TintedBG = styled.View`
    width: 100%;
    height: 100%;
    backgroundColor: rgba(0,0,0,.7);
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
    ${({ bottom }) => bottom ? "bottom: 0;" : "top: 0;" }
    width: 100%;
`
const PlayerView = styled(Player)`
    ${({ isItMyTurn, player }) => {
        if (player.isEliminated) {
            return `backgroundColor: black; color: red;`
        } else if (isItMyTurn) {
            return `backgroundColor: gold; color: ${ BACKGROUND_COLOR };`
        } else {
            return `backgroundColor: ${ BACKGROUND_COLOR }; color: ${ SECONDARY_COLOR };`
        }
    }};
    borderRadius: 50;
`
const Timer = styled.Text`
    color: ${ SECONDARY_COLOR };
    font-size: 24px;
    padding-bottom: 10px;
`
const HighScoresView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 15px;
    position: absolute;
    top: 0;
    width: 100%;
`
const Score = styled.Text`
    color: ${({ isScreenDarkened }) => isScreenDarkened ? BACKGROUND_COLOR : SECONDARY_COLOR };
    font-size: 18px;
`
const Players = ({ player1, player2, performingPlayer, bottom }) => {
    return (
        <PlayersView bottom={ bottom }>
            <PlayerView player={ player1 } isItMyTurn={ performingPlayer.username === player1.username } />
            { player2 &&
                <PlayerView player={ player2 } isItMyTurn={ performingPlayer.username === player2.username } />
            }
        </PlayersView>
    )
}
const HighScores = ({ highScore, isScreenDarkened }) => {
    return (
        <HighScoresView>
            <Score isScreenDarkened={ isScreenDarkened }>
                High Score: { highScore }
            </Score>
        </HighScoresView>
    )
}
class SimonGameScreen extends React.Component {
    static navigatorButtons = {
        rightButtons: [
            {
                title: "Quit",
                id: "quit"
            }
        ],
        leftButtons: []
    }
    componentWillMount() {
        this.props.startGame(this.props.gameMode)

        this.handleBack = this.handleBack.bind(this)

        this.props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    handleBack({ id }) {
        console.log("BUTTON ID:", id)
        if (id === "backPress" || id === "quit") {
            this.props.showBackoutWarningMessage({
                stay: { type: "STAY", onPress: this.props.stay },
                exit: { type: "PLAYER_QUIT_MATCH", onPress: this.props.playerQuitMatch }
            })
        }
    }
    handlePadClick(pad) {
        console.log("PAD CLICKED", pad)
        this.props.simonPadClicked(pad)
    }
    renderHUD() {
        if (this.props.gameMode !== SINGLE_PLAYER_GAME && this.props.players.length > 0) {
            return (
                <Players
                    performingPlayer={ this.props.performingPlayer }
                    player1={ this.props.players[0] }
                    player2={ this.props.players[1] } />
            )
        } else {
            return (
                <HighScores
                    isScreenDarkened={ this.props.isScreenDarkened }
                    highScore={ this.props.highScore } />
            )
        }
    }

    render() {
        return (
            <Container>
                <TintedBG show={ this.props.isScreenDarkened } />
                { this.renderHUD() }
                <Timer>{ this.props.timer }</Timer>
                <SimonGame { ...this.props } onPress={ this.handlePadClick.bind(this) } />
                { this.props.players.length > 2
                    && <Players
                        bottom
                        player1={ this.props.players[2] }
                        player2={ this.props.players[3] }
                        performingPlayer={ this.props.performingPlayer } />
                }
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        hasGameStarted: simonGameSelectors.hasGameStarted(state),
        highScore: userSelectors.getHighScore(state),
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
    return bindActionCreators({ ...simonGameActions, ...navigatorActions }, dispatch)
}

SimonGameScreen.propTypes = {
    animateSimonPad: PropTypes.func.isRequired,
    gameMode: PropTypes.number.isRequired,
    hasGameStarted: PropTypes.bool.isRequired,
    highScore: PropTypes.number.isRequired,
    isItMyTurn: PropTypes.bool.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    isScreenDarkened: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired,
    pads: PropTypes.array.isRequired,
    performingPlayer: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    round: PropTypes.number.isRequired,
    showBackoutWarningMessage: PropTypes.func.isRequired,
    simonPadClicked: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired,
    timer: PropTypes.number.isRequired,
    winner: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(SimonGameScreen)
