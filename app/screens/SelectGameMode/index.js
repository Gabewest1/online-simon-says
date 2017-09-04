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

class StartingScreen extends React.Component {
    render() {
        let { navigator } = this.props

        return (
            <Container>
                <List>
                    <ListItem
                        onPress={ () => navigator.push({
                            screen: "SimonGameScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            passProps: { mode: "single" }
                        }) }
                        color={ "red" }>
                        Single Player
                    </ListItem>
                    <ListItem
                        onPress={ () => navigator.push({
                            screen: "SimonGameScreen",
                            title: "",
                            animated: true,
                            animationType: 'slide-horizontal',
                            passProps: { mode: "multi" }
                        }) }
                        color={ "blue" }>
                        Online
                    </ListItem>
                    <ListItem
                        onPress={ () => navigator.push({
                            screen: "StartingScreen",
                            title: "Leaderboards",
                            animated: true,
                            animationType: 'slide-horiontal'
                        }) }
                        color={ "green" }>
                        Leaderboards
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

StartingScreen.propTypes = {
    navigator: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
