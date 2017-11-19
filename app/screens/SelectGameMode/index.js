import React from "react"
import { Dimensions } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/menu-item"
import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"
import Player from "../../components/player"

import { SINGLE_PLAYER_GAME } from "../../constants"
import { actions as userActions, selectors as userSelectors } from "../../redux/Auth"
import { actions as navigatorActions } from "../../redux/Navigator"
import { actions as simonGameActions } from "../../redux/SimonSaysGame"

const MARGIN_BOTTOM = 35

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
    padding-bottom: 100px;
    margin-bottom: -${MARGIN_BOTTOM};
`

class SelectGameMode extends React.Component {
    componentWillMount() {
        this.props.setGameMode(SINGLE_PLAYER_GAME)
        this.props.navigator.setButtons({
            rightButtons: [{
                id: "Player",
                component: "Player",
                passProps: {
                    player: this.props.myPlayer,
                    style: { height: "100%", width: Dimensions.get("window").width } 
                }
            }]
        })
    }
    render() {
        return (
            <Container>
                <List>
                    <ListItem
                        disabled={ false }
                        style={{ marginBottom: MARGIN_BOTTOM }}
                        onPress={ () => this.props.navigateToScreen({
                            fn: "resetTo",
                            navigationOptions: {
                                screen: "SimonGameScreen",
                                title: "",
                                animated: true,
                                animationType: 'slide-horizontal',
                                passProps: { gameMode: SINGLE_PLAYER_GAME },
                                overrideBackPress: true
                            }
                        }) }
                        color={ "red" }
                        icon={{ name: "person" }}>
                        Single Player
                    </ListItem>
                    <ListItem
                        style={{ marginBottom: MARGIN_BOTTOM }}
                        onPress={ () => this.props.navigateToScreen({
                            fn: "push",
                            navigationOptions: {
                                screen: "SelectOnlineGameMode",
                                title: "",
                                animated: true,
                                animationType: 'slide-horizontal',
                                overrideBackPress: true
                            }
                        }) }
                        color={ "blue" }
                        icon={{ name: "language" }}>
                        Online
                    </ListItem>
                    <ListItem
                        style={{ marginBottom: MARGIN_BOTTOM }}
                        onPress={ () => this.props.navigateToScreen({
                            fn: "push",
                            navigationOptions: {
                                screen: "Leaderboards",
                                title: "Leaderboards",
                                animated: true,
                                animationType: 'slide-horiontal',
                                overrideBackPress: true
                            }
                        }) }
                        color={ "green" }
                        icon={{ name: "view-list" }}>
                        Leaderboards
                    </ListItem>
                    <ListItem
                        disabled={ false }
                        onPress={ () => {
                            this.props.logout()
                            this.props.navigateToScreen({
                                fn: "resetTo",
                                navigationOptions: {
                                    screen: "StartingScreen",
                                    title: "Home",
                                    animated: true,
                                    animationType: 'slide-horiontal'
                                }
                            })
                        } }
                        color={ "green" }
                        icon={{ name: "exit-to-app" }}>
                        Logout
                    </ListItem>
                </List>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return { myPlayer: userSelectors.getUser(state) }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...userActions, ...navigatorActions, ...simonGameActions }, dispatch)
}

SelectGameMode.propTypes = {
    myPlayer: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    navigateToScreen: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    setGameMode: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectGameMode)
