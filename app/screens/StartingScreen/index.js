import React from "react"
import { View } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types" 

import ListItem from "../../components/list-item--circle"
import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"
import SignInForm from "../../components/sign-in-form"

import { actions as userActions } from "../../redux/Auth"

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
    padding-bottom: 100px;
`

class StartingScreen extends React.Component {
    constructor(props) {
        super(props)

        props.giveSagasNavigator(props.navigator)
    }
    render() {
        let { navigator, playAsGuest } = this.props

        return (
            <Container>
                <SimonSaysLogo />
                <List>
                    <SignInForm navigator={ navigator } playAsGuest={ playAsGuest } />
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

StartingScreen.propTypes = {
    giveSagasNavigator: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
