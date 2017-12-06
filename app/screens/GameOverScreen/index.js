import React from "react"
import { Dimensions } from "react-native"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import styled from "styled-components/native"
import Background from "../../components/background"
import { SINGLE_PLAYER_GAME, PRIVATE_MATCH, SECONDARY_COLOR } from "../../constants"

import ListItem from "../../components/menu-item"

import { actions as simonGameActions, selectors as simonGameSelectors } from "../../redux/SimonSaysGame"
import { actions as navigatorActions } from "../../redux/Navigator"

const Container = styled.View`
    width: 80%;
`
const Text = styled.Text`
    font-size: ${ Dimensions.get("window").width >= 768 ? 30 : 20 };
    color: ${ SECONDARY_COLOR };
    position: absolute;
    top: 50;
    border-bottom-width: 5;
    border-color: ${ SECONDARY_COLOR };
    text-align: center;
`
const Moves = styled.View`
    width: 100%;
    align-items: center;
    position: absolute;
    top: ${ Dimensions.get("window").width >= 768 ? '20%' : "15%" };
`
const WrongMove = CorrectMove = styled.Text`
    font-size: ${ Dimensions.get("window").width >= 768 ? 48 : 24 };
`

class GameOverScreen extends React.Component {
    componentWillMount() {
        this.props.resetGame()

        //The players array gets cleared when the game resets
        //so need to retrieve the players again.
        if (this.props.gameMode === PRIVATE_MATCH) {
            this.props.fetchPlayersInLobby()            
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.gameMode === this.props.gameMode
    } 
    findNextMatch() {
        this.props.navigateToScreen({
            fn: "push",
            navigationOptions: {
                screen: "FindMatchScreen",
                title: "",
                animated: true,
                animationType: 'slide-horizontal',
                overrideBackPress: true
            }
        })
    }
    playAgain() {
        this.props.navigateToScreen({
            fn: "push",
            navigationOptions: {
                screen: "SimonGameScreen",
                title: "",
                animated: true,
                animationType: 'slide-horizontal',
                overrideBackPress: true
            }
        })
    }
    returnToPrivateMatchLobby() {
        this.props.navigateToScreen({
            fn: "push",
            navigationOptions: {
                screen: "InvitePlayersScreen",
                title: "",
                animated: true,
                animationType: 'slide-horizontal',
                overrideBackPress: true
            }
        })
    }
    render() {
        const isAPrivateMatch = this.props.gameMode === PRIVATE_MATCH

        const onPress = this.props.gameMode === SINGLE_PLAYER_GAME
            ? this.playAgain.bind(this)
            : isAPrivateMatch
                ? this.returnToPrivateMatchLobby.bind(this)
                : this.findNextMatch.bind(this)

        const playAgainText = this.props.gameMode === SINGLE_PLAYER_GAME
            ? "Play Again"
            : isAPrivateMatch
                ? "Return to lobby"
                : "Find Next Match"

        return (
            <Background centered>
                { this.props.gameMode === SINGLE_PLAYER_GAME
                    ? this.renderMoves()
                    : <Text>{ this.props.winner.username } Won!</Text>
                }
                <Container>
                    <ListItem
                        disabled={ false }
                        title={ playAgainText }
                        style={{ marginBottom: 35 }}
                        onPress={ () => onPress() } />
                    { !isAPrivateMatch && <ListItem
                        disabled={ false }
                        title="Quit"
                        onPress={ () => this.props.navigateToScreen({
                            fn: "resetTo",
                            navigationOptions: {
                                screen: "SelectGameMode",
                                title: "",
                                animated: true,
                                animationType: 'slide-horizontal',
                                overrideBackPress: true,
                                backButtonHidden: true
                            }
                        }) } />
                    }
                </Container>
            </Background>
        )
    }

    renderMoves() {
        const wrongMoveText = this.props.wrongMove.match(/[red|blue|green|yellow]/i)
            ? `You chose: ${ this.props.wrongMove }`
            : "You Timedout"

        return (
            <Moves>
                <WrongMove>{ wrongMoveText }</WrongMove>
                <CorrectMove>Correct move: { this.props.correctMove }</CorrectMove>
            </Moves>
        )
    }
}

function mapStateToProps(state) {
    return {
        correctMove: simonGameSelectors.getCorrectMove(state),
        gameMode: simonGameSelectors.getGameMode(state),
        wrongMove: simonGameSelectors.getWrongMove(state)
    }
}

function mapDispatchToProps(dispatch) {
    const fetchPlayersInLobby = () => ({ type: "server/SYNC_PLAYERS_WITH_REDUX" })

    return bindActionCreators({ ...simonGameActions, ...navigatorActions, fetchPlayersInLobby }, dispatch)
}

GameOverScreen.propTypes = {
    correctMove: PropTypes.number,
    gameMode: PropTypes.number.isRequired,
    navigateToScreen: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    resetGame: PropTypes.func.isRequired,
    winner: PropTypes.object,
    wrongMove: PropTypes.number
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOverScreen)
