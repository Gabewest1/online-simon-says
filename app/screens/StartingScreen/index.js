import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"

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
        return (
            <Container>
                <SimonSaysLogo />
                <List>
                    <ListItem color={ "red" }>
                        Sign-up
                    </ListItem>
                    <ListItem color={ "blue" }>
                        Login
                    </ListItem>
                    <ListItem color={ "green" }>
                        Play as a guest
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

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
