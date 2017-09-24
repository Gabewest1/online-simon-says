import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/list-item--circle"
import SimonSaysLogo from "../../components/simon__logo"

const Container = styled.View`
    height: 100%;
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
    padding-bottom: 100px;
`
const TWO_PLAYER_GAME = 2
const THREE_PLAYER_GAME = 3
const FOUR_PLAYER_GAME = 4

class SelectOnlineGameMode extends React.Component {
    render() {
        let { navigator } = this.props

        return (
            <Container>
                <List>
                    <ListItem
                        onPress={ () => navigator.push({
                            screen: "FindMatchScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            passProps: { gameMode: TWO_PLAYER_GAME }
                        }) }
                        color={ "red" }>
                        Two Player
                    </ListItem>
                    <ListItem
                        onPress={ () => navigator.push({
                            screen: "FindMatchScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            passProps: { gameMode: THREE_PLAYER_GAME }
                        }) }
                        color={ "blue" }>
                        Three Player
                    </ListItem>
                    <ListItem
                        onPress={ () => navigator.push({
                            screen: "FindMatchScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horiontal',
                            passProps: { gameMode: FOUR_PLAYER_GAME }
                        }) }
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
