import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import styled from "styled-components/native"
import Background from "../../components/background"
import { SINGLE_PLAYER_GAME } from "../../constants"

import ListItem from "../../components/list-item--circle"

import { actions as simonGameActions } from "../../redux/SimonSaysGame"

const Container = styled.View`
    width: 80%;
`
const Text = styled.Text`

`

class SinglePlayerGameOverScreen extends React.Component {
    componentWillMount() {
        this.props.resetGame()
    }
    render() {
        return this.props.gameMode === SINGLE_PLAYER_GAME ? this.renderSinglePlayer() : this.renderOnlineGameOver()
    }
    renderSinglePlayer() {
        return (
            <Background centered>
                <Container>
                    <ListItem
                        title="Play Again"
                        onPress={ () => this.props.navigator.resetTo({
                            screen: "SimonGameScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            overrideBackPress: true,
                            backButtonHidden: true,
                            passProps: { gameMode: this.props.gameMode }
                        }) } />
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
    renderOnlineGameOver() {
        return (
            <Background centered>
                <Container>
                    <ListItem
                        title="Find Next Match"
                        onPress={ () => this.props.navigator.resetTo({
                            screen: "FindMatchScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            overrideBackPress: true,
                            backButtonHidden: true
                        }) } />
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
    resetGame: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePlayerGameOverScreen)
