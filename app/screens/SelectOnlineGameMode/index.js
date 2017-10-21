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

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
`


class SelectOnlineGameMode extends React.Component {
    gotoGameScreen(gameMode) {
        this.props.navigator.push({
            screen: "FindMatchScreen",
            title: "",
            animated: true,
            animationType: 'slide-horizontal',
            passProps: { gameMode },
            overrideBackPress: true
        })
    }
    render() {
        return (
            <Container>
                <List>
                    <ListItem
                        onPress={ () => this.props.createPrivateMatch() }
                        style={{ marginBottom: 35 }}
                        icon={{ name: "looks-two" }}>
                        Challenge a friend
                    </ListItem>
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
                        onPress={ () => this.gotoGameScreen(FOUR_PLAYER_GAME) }
                        icon={{ name: "looks-4" }}>
                        Four Player
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
    return bindActionCreators({ ...simonGameActions }, dispatch)
}

SelectOnlineGameMode.propTypes = {
    createPrivateMatch: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectOnlineGameMode)
