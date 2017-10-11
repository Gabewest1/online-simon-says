import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/list-item--circle"
import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"

import { SINGLE_PLAYER_GAME } from "../../constants"
import { actions as userActions } from "../../redux/Auth"

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
    render() {
        return (
            <Container>
                <List>
                    <ListItem
                        style={{ marginBottom: MARGIN_BOTTOM }}
                        onPress={ () => this.props.navigator.push({
                            screen: "SimonGameScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            passProps: { gameMode: SINGLE_PLAYER_GAME },
                            overrideBackPress: true,
                            backButtonHidden: true
                        }) }
                        color={ "red" }
                        icon={{ name: "person" }}>
                        Single Player
                    </ListItem>
                    <ListItem
                        style={{ marginBottom: MARGIN_BOTTOM }}
                        onPress={ () => this.props.navigator.push({
                            screen: "SelectOnlineGameMode",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal'
                        }) }
                        color={ "blue" }
                        icon={{ name: "language" }}>
                        Online
                    </ListItem>
                    <ListItem
                        style={{ marginBottom: MARGIN_BOTTOM }}
                        onPress={ () => this.props.navigator.push({
                            screen: "Leaderboards",
                            title: "Leaderboards",
                            animated: true,
                            animationType: 'slide-horiontal'
                        }) }
                        color={ "green" }
                        icon={{ name: "view-list" }}>
                        Leaderboards
                    </ListItem>
                    <ListItem
                        onPress={ () => {
                            this.props.logout()
                            this.props.navigator.pop()
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

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...userActions }, dispatch)
}

SelectGameMode.propTypes = {
    logout: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectGameMode)
