import React from "react"
import { AppState } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import socket from "../../socket"

import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"
import SignInForm from "../../components/sign-in-form"

import { actions as userActions, selectors as userSelectors } from "../../redux/Auth"
import { actions as navigatorActions } from "../../redux/Navigator"

const SignInFormFlex = styled(SignInForm)`
    justify-content: flex-start;
`
const SimonSaysLogoFlex = styled(SimonSaysLogo)`
    justify-content: flex-end;
    align-items: center;
`

//Need to prevent the same handlers from getting set everytime this
//screen is mounted. Causes the callbacks to get invoked more 
//than once.
let areEventHandlersConnected = false

class StartingScreen extends React.Component {
    static navigatorStyle = {
        navBarHidden: true
    }
    constructor(props) {
        super(props)

        //Injects Navigator sagas with the navigator object so I can
        //dispatch screen navigations and notifications from
        //within my sagas.
        props.giveSagasNavigator(props.navigator)
    }
    componentDidMount() {
        console.log("is Disconnect Handler Set:", areEventHandlersConnected)
        if (!areEventHandlersConnected) {
            AppState.addEventListener('change', this.handleAppStateChange)

            if (socket.connected) {
                this.props.socketConnected()
            }

            socket.on("connect", () => {
                this.props.socketConnected()
            })
            socket.on("disconnect", () => {
                console.log("I DISCONNECTED DDDDDD:")
                this.props.socketDisconnected()
            })

            socket.on("reconnecting", () => {
                console.log("TRYING TO RECONNECT TO THE SERVER")
            })

            socket.on("reconnect", () => {
                console.log("SUCCESSFULLY RECONNECTED TO THE SERVER! :D")
                this.props.socketReconnected()
            })

            areEventHandlersConnected = true
        }
    }
    handleAppStateChange = nextAppState => {
        if (nextAppState === "active") {
            console.log("ACTIVATING THE APP")
            this.props.appStateActive()
        }
    }
    render() {
        let { isLoading, navigator, playAsGuest } = this.props

        return (
            <Background centered>
                <SimonSaysLogoFlex />
                <SignInFormFlex navigator={ navigator } playAsGuest={ playAsGuest } isLoading={ isLoading } />
            </Background>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: userSelectors.isLoading(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...userActions, ...navigatorActions }, dispatch)
}

StartingScreen.propTypes = {
    appStateActive: PropTypes.func.isRequired,
    giveSagasNavigator: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired,
    socketConnected: PropTypes.func.isRequired,
    socketDisconnected: PropTypes.func.isRequired,
    socketReconnected: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
