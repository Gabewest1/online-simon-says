import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/list-item--circle"
import SimonSaysLogo from "../../components/simon__logo"

import { TWO_PLAYER_GAME, THREE_PLAYER_GAME, FOUR_PLAYER_GAME } from "../../gameModeConstants"

const Container = styled.View`
    height: 100%;
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
    padding-bottom: 100px;
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
                        onPress={ () => this.gotoGameScreen(TWO_PLAYER_GAME) }
                        color={ "red" }>
                        Two Player
                    </ListItem>
                    <ListItem
                        onPress={ () => this.gotoGameScreen(THREE_PLAYER_GAME) }
                        color={ "blue" }>
                        Three Player
                    </ListItem>
                    <ListItem
                        onPress={ () => this.gotoGameScreen(FOUR_PLAYER_GAME) }
                        color={ "green" }>
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

function mapDispatchToProps() {
    return {}
}

SelectOnlineGameMode.propTypes = {
    navigator: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectOnlineGameMode)
