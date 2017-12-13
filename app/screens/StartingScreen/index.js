import React from "react"
import { AppState, Dimensions, Platform, Keyboard } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import socket from "../../socket"

import KeyboardSpacer from "react-native-keyboard-spacer"

import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"
import SignInForm from "../../components/sign-in-form"
import CancelKeyboard from "../../components/CancelKeyboard"

import { actions as userActions, selectors as userSelectors } from "../../redux/Auth"
import { actions as navigatorActions, selectors as navigatorSelectors } from "../../redux/Navigator"

console.log("HEIGHT:", Dimensions.get("window").height)
const SignInFormFlex = styled(SignInForm)`
    
`
const SimonSaysLogoFlex = styled(SimonSaysLogo)`
    align-items: center;
    justify-content: center;
`
const Container = styled.View`
    width: ${ Dimensions.get("window").width };
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
        if (!areEventHandlersConnected) {
            AppState.addEventListener('change', this.handleAppStateChange)

            if (socket.connected) {
                this.props.socketConnected()
            }

            socket.on("connect", () => {
                this.props.socketConnected()
            })
            socket.on("disconnect", () => {
                // console.log("I DISCONNECTED DDDDDD:")
                this.props.socketDisconnected()
            })

            socket.on("reconnecting", () => {
                // console.log("TRYING TO RECONNECT TO THE SERVER")
            })

            socket.on("reconnect", () => {
                // console.log("SUCCESSFULLY RECONNECTED TO THE SERVER! :D")
                this.props.socketReconnected()
            })

            areEventHandlersConnected = true
            
            if (!this.props.isOnline) {
                console.log("IS ONLINE:", this.props.isOnline)
                this.props.showConnectingToServerMessage()
            }
        }

    }
    handleAppStateChange = nextAppState => {
        if (nextAppState === "active") {
            this.props.appStateActive()
        }
    }
    render() {
        let { isLoading, navigator, playAsGuest } = this.props

        return (
            <CancelKeyboard>
                <Background around>
                    
                    <SimonSaysLogoFlex />

                    { Platform.OS === "ios" && <KeyboardSpacer /> }
                    
                    <SignInFormFlex navigator={ navigator } playAsGuest={ playAsGuest } isLoading={ isLoading } />

                    { Platform.OS === "ios" && <KeyboardSpacer /> }

                </Background>
            </CancelKeyboard>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: userSelectors.isLoading(state),
        isOnline: navigatorSelectors.doesPlayerHaveInternet(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...userActions, ...navigatorActions }, dispatch)
}

StartingScreen.propTypes = {
    appStateActive: PropTypes.func.isRequired,
    giveSagasNavigator: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isOnline: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired,
    socketConnected: PropTypes.func.isRequired,
    socketDisconnected: PropTypes.func.isRequired,
    socketReconnected: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
