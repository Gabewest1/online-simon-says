import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import styled from "styled-components/native"
import Background from "../../components/background"
import { SINGLE_PLAYER_GAME } from "../../constants"

import ListItem from "../../components/menu-item"

import { actions as simonGameActions } from "../../redux/SimonSaysGame"

const Container = styled.View`
    width: 80%;
`
const Text = styled.Text`
    font-size: 36;
    color: white;
    position: absolute;
    top: 50;
    border-bottom-width: 5;
    border-color: white;
`

class SinglePlayerGameOverScreen extends React.Component {
    componentWillMount() {
        this.props.resetGame()
    }
    findNextMatch() {
        this.props.navigator.resetTo({
            screen: "FindMatchScreen",
            title: "",
            animated: true,
            animationType: 'slide-horizontal',
            overrideBackPress: true,
            backButtonHidden: true,
            passProps: { gameMode: this.props.gameMode }
        })
    }
    playAgain() {
        console.log(this.props)
        this.props.navigator.resetTo({
            screen: "SimonGameScreen",
            title: "",
            animated: true,
            animationType: 'slide-horizontal',
            overrideBackPress: true,
            backButtonHidden: true,
            passProps: { gameMode: this.props.gameMode }
        })
    }
    render() {
        const onPress = this.props.gameMode === SINGLE_PLAYER_GAME ? this.playAgain.bind(this) : this.findNextMatch.bind(this)
        const playAgainText = this.props.gameMode === SINGLE_PLAYER_GAME ? "Play Again" : "Find Next Match"

        return (
            <Background centered>
                { this.props.gameMode !== SINGLE_PLAYER_GAME &&
                    <Text>{ this.props.winner.username } Won!</Text>
                }
                <Container>
                    <ListItem
                        title={ playAgainText }
                        style={{ marginBottom: 35 }}
                        onPress={ () => onPress() } />
                    <ListItem
                        title="Quit"
                        onPress={ () => this.props.navigator.resetTo({
                            screen: "SelectGameMode",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            overrideBackPress: true,
                            backButtonHidden: true
                        }) } />
                </Container>
            </Background>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions }, dispatch)
}

SinglePlayerGameOverScreen.propTypes = {
    gameMode: PropTypes.number.isRequired,
    navigator: PropTypes.object.isRequired,
    resetGame: PropTypes.func.isRequired,
    winner: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePlayerGameOverScreen)
