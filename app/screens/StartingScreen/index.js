import React from "react"
import { AppState, View } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"
import socket from "../../socket"

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
        //perform screen navigations and display notifications from
        //within my sagas.
        props.giveSagasNavigator(props.navigator)
    }
    componentDidMount() {
        console.log("is Disconnect Handler Set:", areEventHandlersConnected)
        if (!areEventHandlersConnected) {
            AppState.addEventListener('change', this.handleAppStateChange)

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
    handleAppStateChange = (nextAppState) => {
        if (nextAppState === "active") {
            console.log("ACTIVATING THE APP")
            this.props.appActive()
        }
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
    const appActive = () => ({ type: "APP_ACTIVE" })
    const socketDisconnected = () => ({ type: "SOCKET_DISCONNECTED" })
    const socketReconnected = () => ({ type: "SOCKET_RECONNECTED" })

    return bindActionCreators({ ...userActions, appActive, socketDisconnected, socketReconnected }, dispatch)
}

StartingScreen.propTypes = {
    giveSagasNavigator: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
