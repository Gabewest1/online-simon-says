import React from "react"
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
    font-size: 36;
    color: ${ SECONDARY_COLOR };
    position: absolute;
    top: 50;
    border-bottom-width: 5;
    border-color: ${ SECONDARY_COLOR };
`

class GameOverScreen extends React.Component {
    componentWillMount() {
        this.props.resetGame()

        if (this.props.gameMode === PRIVATE_MATCH) {
            this.props.fetchPlayersInLobby()            
        }
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
            fn: "resetTo",
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
            fn: "resetTo",
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
                { this.props.gameMode !== SINGLE_PLAYER_GAME &&
                    <Text>{ this.props.winner.username } Won!</Text>
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
                        }) } />}
                </Container>
            </Background>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameMode: simonGameSelectors.getGameMode(state)
    }
}

function mapDispatchToProps(dispatch) {
    const fetchPlayersInLobby = () => ({ type: "server/SYNC_PLAYERS_WITH_REDUX" })

    return bindActionCreators({ ...simonGameActions, ...navigatorActions, fetchPlayersInLobby }, dispatch)
}

GameOverScreen.propTypes = {
    gameMode: PropTypes.number.isRequired,
    navigateToScreen: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    resetGame: PropTypes.func.isRequired,
    winner: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOverScreen)
