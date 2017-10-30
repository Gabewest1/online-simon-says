import React from "react"
import { View } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types" 

import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"
import SignInForm from "../../components/sign-in-form"
import SimonGameBoard from "../../components/simon__game"

import { actions as userActions } from "../../redux/Auth"

const SignInFormFlex = styled(SignInForm)`
    flex-grow: 2;
    justify-content: flex-start;
`
const SimonSaysLogoFlex = styled(SimonSaysLogo)`
    flex-grow: 1;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 40;
`
class StartingScreen extends React.Component {
    static navigatorStyle = {
        navBarHidden: true
    }
    constructor(props) {
        super(props)

        props.giveSagasNavigator(props.navigator)
    }
    render() {
        let { navigator, playAsGuest } = this.props

        return (
            <Background center>
                <SimonSaysLogoFlex />
                <SignInFormFlex navigator={ navigator } playAsGuest={ playAsGuest } />
            </Background>
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
