import React from "react"
import PropTypes from "prop-types"
import { AsyncStorage, Dimensions } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"

import Player from "../../components/player"
import Background from "../../components/background"
import BoardView from "../../components/BoardView"
import TintedBG from "../../components/TintedBG"
import CustomNavbar from "../CustomNavbar"

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
        
    }};
    borderRadius: 50;
`
const Timer = styled.Text`
    color: ${({ isScreenDarkened }) => isScreenDarkened ? BACKGROUND_COLOR : SECONDARY_COLOR };
    font-size: 24px;
    padding-bottom: 10px;
    background-color: transparent;    
    `
const HighScoresView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 35px;
    position: absolute;
    top: 0;
    width: 100%;
    `
const Score = styled.Text`
    color: ${({ isScreenDarkened }) => isScreenDarkened ? BACKGROUND_COLOR : SECONDARY_COLOR };
    background-color: transparent;    
    font-size: 22px;
    font-weight: 500;
    `
const Text = styled.Text`

    `
const Players = ({ player1, player2, performingPlayer, bottom }) => {
    const fontSize = Dimensions.get("window").width >= 768 ? 18 : 10
    const name1 = { style: { fontSize }}
    const name2 = { style: { fontSize }}
    const containerStyle1 = {}
    const containerStyle2 = {}

    const getColor = player => {
        if (player.isEliminated) {
            return "red"
        } else {
            return `${ SECONDARY_COLOR }`
        }
    }

    const getBackgroundColor = player => {
        if (player.isEliminated) {
            return "black"
        } else if (performingPlayer.username === player.username) {
            return `gold`
        } else {
            return `${ BACKGROUND_COLOR }`
        }
    }

    name1.style.color = getColor(player1)
    name2.style.color = player2 && getColor(player2)
    containerStyle1.backgroundColor = getBackgroundColor(player1)
    containerStyle2.backgroundColor = player2 && getBackgroundColor(player2)

    return (
        <PlayersView bottom={ bottom }>
            <PlayerView
                player={ player1 }
                isItMyTurn={ performingPlayer.username === player1.username }
                name={ name1 }
                style={ containerStyle1 } />
            { player2 &&
                <PlayerView
                    player={ player2 }
                    isItMyTurn={ performingPlayer.username === player2.username }
                    name={ name2 }
                    style={ containerStyle2 } />
            }
        </PlayersView>
    )
}
const HighScores = ({ highScore, isScreenDarkened, round }) => {
    return (
        <HighScoresView>
            <Score isScreenDarkened={ isScreenDarkened }>
                Best: { highScore }
            </Score>
            <Score isScreenDarkened={ isScreenDarkened }>
                Score: { round }
            </Score>
        </HighScoresView>
    )
}
class SimonGameScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = { highScore: 0 }
    }
    componentWillMount() {
        //Server emits a SET_GAME_MODE for multiplayer games.
        //Need to emit that this is a single player game if not a multiplayer one.
        if (this.props.gameMode === SINGLE_PLAYER_GAME) {
            this.props.setGameMode(SINGLE_PLAYER_GAME)
        }

        this.props.startGame(this.props.gameMode)

        this.handleBack = this.handleBack.bind(this)

        this.props.navigator.setOnNavigatorEvent(this.handleBack)
        this.getHighScore()
    }
    handleBack({ id }) {
        if (id === "backPress" || id === "quit") {
            this.props.showBackoutWarningMessage({
                stay: { type: "STAY", onPress: this.props.stay },
                exit: { type: "PLAYER_QUIT_MATCH", onPress: this.props.playerQuitMatch }
            })
        }
    }
    handlePadClick(pad) {
        this.props.simonPadClicked(pad)
    }
    async getHighScore() {
        try {
            const value = parseInt( await AsyncStorage.getItem('highscore'))

            if (!!value) {
                this.setState({ highScore: value })
            } else {
                this.setState({ highScore: 0 })
            }
        } catch (error) {
            console.log(error)
        }
    }
    renderHUD() {
        const highScore = this.props.isAGuest ? this.state.highScore : this.props.highScore

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
                    highScore={ highScore }
                    round={ this.props.round } />
            )
        }
    }

    render() {
        const { gameMode, performingPlayer, players, isLastMove, isItMyTurn, isScreenDarkened, waitingForOpponents } = this.props
        const isMultiplayerGame = gameMode > SINGLE_PLAYER_GAME
        const multiplayerGameMessageForPerformingPlayer =
            waitingForOpponents ? "Waiting for opponents..."
                : isLastMove ? "Add a new move!"
                    : "It's your turn!"

        return (
            <Container>
                <TintedBG show={ isScreenDarkened } />
                { this.renderHUD() }
                <Timer isScreenDarkened={ isScreenDarkened }>{ this.props.timer }</Timer>
                <BoardView { ...this.props } onPress={ this.handlePadClick.bind(this) } />
                { isMultiplayerGame && isItMyTurn && <Text>{ multiplayerGameMessageForPerformingPlayer }</Text> }
                { players.length > 2
                    && <Players
                        bottom
                        player1={ players[2] }
                        player2={ players[3] }
                        performingPlayer={ performingPlayer } />
                }
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        disableOnPress: simonGameSelectors.disableOnPress(state),
        gameMode: simonGameSelectors.getGameMode(state),
        hasGameStarted: simonGameSelectors.hasGameStarted(state),
        highScore: userSelectors.getHighScore(state),
        isAGuest: userSelectors.isAGuest(state),
        isGameOver: simonGameSelectors.isGameOver(state),
        isItMyTurn: simonGameSelectors.isItMyTurn(state),
        isLastMove: simonGameSelectors.isLastMove(state),
        isScreenDarkened: simonGameSelectors.isScreenDarkened(state),
        lit: simonGameSelectors.getAnimatingPadIndex(state),
        moveIndex: simonGameSelectors.getMoveIndex(state),
        numberOfMoves: simonGameSelectors.numberOfMoves(state),
        pads: simonGameSelectors.getPads(state),
        performingPlayer: simonGameSelectors.selectPerformingPlayer(state),
        players: simonGameSelectors.getPlayers(state),
        round: simonGameSelectors.getCurrentRound(state),
        timer: simonGameSelectors.getTimer(state),
        waitingForOpponents: simonGameSelectors.isWaitingForOpponents(state),
        winner: simonGameSelectors.getWinner(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions, ...navigatorActions }, dispatch)
}

SimonGameScreen.propTypes = {
    animateSimonPad: PropTypes.func.isRequired,
    disableOnPress: PropTypes.bool.isRequired,
    gameMode: PropTypes.number.isRequired,
    isAGuest: PropTypes.bool.isRequired,
    hasGameStarted: PropTypes.bool.isRequired,
    highScore: PropTypes.number.isRequired,
    isItMyTurn: PropTypes.bool.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    isLastMove: PropTypes.bool.isRequired,
    isScreenDarkened: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired,
    numberOfMoves: PropTypes.number.isRequired,
    performingPlayer: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    round: PropTypes.number.isRequired,
    setGameMode: PropTypes.func.isRequired,
    showBackoutWarningMessage: PropTypes.func.isRequired,
    simonPadClicked: PropTypes.func.isRequired,
    startGame: PropTypes.func.isRequired,
    timer: PropTypes.number.isRequired,
    waitingForOpponents: PropTypes.bool.isRequired,
    winner: PropTypes.object
}

export default CustomNavbar(connect(mapStateToProps, mapDispatchToProps)(SimonGameScreen))
