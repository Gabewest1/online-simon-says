import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/menu-item"
import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"

import { TWO_PLAYER_GAME, THREE_PLAYER_GAME, FOUR_PLAYER_GAME } from "../../constants"
import { actions as simonGameActions } from "../../redux/SimonSaysGame"
import { actions as navigatorActions } from "../../redux/Navigator"

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
`

class SelectOnlineGameMode extends React.Component {
    constructor(props) {
        super(props)

        this.handleBack = this.handleBack.bind(this)
        this.props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    handleBack({ id }) {
        if (id === "backPress") {
            this.props.navigateToScreen({
                fn: "pop",
                navigationOptions: {
                    screen: "SelectGameMode",
                    backButtonHidden: true
                }
            })
        }

        return true
    }
    gotoGameScreen(gameMode) {
        const navigationOptions = {
            screen: "FindMatchScreen",
            title: "",
            animated: true,
            animationType: 'slide-horizontal',
            passProps: { gameMode },
            overrideBackPress: true
        }

        this.props.navigateToScreen({ fn: "push", navigationOptions })
    }
    render() {
        return (
            <Container>
                <List>
                    <ListItem
                        onPress={ () => this.gotoGameScreen(TWO_PLAYER_GAME) }
                        style={{ marginBottom: 35 }}
                        icon={{ name: "looks-two" }}>
                        Two Player
                    </ListItem>
                    <ListItem
                        onPress={ () => this.gotoGameScreen(THREE_PLAYER_GAME) }
                        style={{ marginBottom: 35 }}
                        icon={{ name: "looks-3" }}>
                        Three Player
                    </ListItem>
                    <ListItem
                        style={{ marginBottom: 35 }}                
                        onPress={ () => this.gotoGameScreen(FOUR_PLAYER_GAME) }
                        icon={{ name: "looks-4" }}>
                        Four Player
                    </ListItem>
                    <ListItem
                        inverted
                        onPress={ () => this.props.createPrivateMatch() }
                        icon={{ name: "looks-two" }}>
                        Private Match
                    </ListItem>
                </List>
            </Container>
        )
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions, ...navigatorActions }, dispatch)
}

SelectOnlineGameMode.propTypes = {
    createPrivateMatch: PropTypes.func.isRequired,
    navigateToScreen: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectOnlineGameMode)
