import React from "react"
import { Dimensions } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/menu-item"
import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"
import CustomNavbar from "../CustomNavbar"

import { TWO_PLAYER_GAME, THREE_PLAYER_GAME, FOUR_PLAYER_GAME, BACKGROUND_COLOR, SECONDARY_COLOR } from "../../constants"
import { actions as simonGameActions } from "../../redux/SimonSaysGame"
import { actions as navigatorActions } from "../../redux/Navigator"

const MARGIN_BOTTOM = 35

const List = styled.View`
    width: 80%;
    margin-top: -${ MARGIN_BOTTOM };
`
const RulesView = styled.View`
    background-color: ${ SECONDARY_COLOR };
    position: absolute;
    bottom: 0;
    padding: 10px 0px;
    width: ${ Dimensions.get("window").width };
`
const Rules = styled.Text`
    font-size: 16px;
    text-align: center;
    color: ${ BACKGROUND_COLOR };
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
        this.props.setGameMode(gameMode)

        const navigationOptions = {
            screen: "FindMatchScreen",
            title: "",
            animated: true,
            animationType: 'slide-horizontal',
            overrideBackPress: true
        }

        this.props.navigateToScreen({ fn: "push", navigationOptions })
    }
    render() {
        return (
            <Background centered>
                <List>
                    <ListItem
                        onPress={ () => this.gotoGameScreen(TWO_PLAYER_GAME) }
                        style={{ marginBottom: MARGIN_BOTTOM }}>
                        Two Player
                    </ListItem>
                    <ListItem
                        onPress={ () => this.gotoGameScreen(THREE_PLAYER_GAME) }
                        style={{ marginBottom: MARGIN_BOTTOM }}>
                        Three Player
                    </ListItem>
                    <ListItem
                        style={{ marginBottom: MARGIN_BOTTOM }}                
                        onPress={ () => this.gotoGameScreen(FOUR_PLAYER_GAME) }>
                        Four Player
                    </ListItem>
                    <ListItem
                        inverted
                        onPress={ () => this.props.createPrivateMatch() }>
                        Private Match
                    </ListItem>
                </List>

                <RulesView>
                    <Rules>Take turns mimicing your opponents moves then stumping them with one of your own!</Rules>
                </RulesView>
            </Background>
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

export default CustomNavbar(connect(mapStateToProps, mapDispatchToProps)(SelectOnlineGameMode))
