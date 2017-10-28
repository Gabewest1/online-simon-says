import React from "react"
import PropTypes from "prop-types"
import { Keyboard } from "react-native"
import { CheckBox, SearchBar } from "react-native-elements"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import { reduxForm, Field, SubmissionError } from "redux-form"

import Player from "../../components/player"
import Background from "../../components/background"
import MenuItem from "../../components/menu-item"
import Input from "../../components/input"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

import { actions as navigatorActions } from "../../redux/Navigator"

import { selectors as userSelectors } from "../../redux/Auth"

const InvitedPlayerView = styled.View`

`
const Countdown = styled.View`

`
const TimeLeft = styled.Text`

`

class InvitePlayersScreen extends React.Component {
    static navigatorButtons = {
        rightButtons: [
            {
                title: "Quit",
                id: "quit"
            }
        ],
        leftButtons: []
    }
    constructor(props) {
        super(props)

        this.state = {
            timeLeft: 3,
        }

        this.timer = undefined
        this.validate = this.validate.bind(this)
        this.handleBack = this.handleBack.bind(this)
        this.handleTimer = this.handleTimer.bind(this)

        props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    arePlayersReadyToStart() {
        const thereIsMoreThanOnePlayer = this.props.players.length > 1
        const numPlayersNotReady = this.props.players.filter(player => !player.isReady).length

        return thereIsMoreThanOnePlayer && numPlayersNotReady === 0
    }
    handleBack({ id }) {
        if (id === "backPress" || id === "quit") {
            console.log("EXIT ACTION:", this.props)
            this.props.showBackoutWarningMessage({
                stay: { type: "STAY", onPress: this.props.stay },
                exit: { type: "CANCEL_PRIVATE_MATCH", onPress: this.props.cancelPrivateMatch }
            })
        }
    }
    handleTimer() {
        const timeLeft = this.state.timeLeft - 1

        if (timeLeft >= 0) {
            this.setState({ timeLeft })
        } else {
            this.timer = clearInterval(this.timer)
            this.props.dispatch({ type: "server/START_GAME" })
        }
    }
    validate(values) {
        Keyboard.dismiss()

        values.username = values.username && values.username.toLowerCase().trim()

        let errors = {}

        const isUserAlreadyInGameRoom = this.props.players.find(player => player.username.toLowerCase() === values.username)

        errors.username = isUserAlreadyInGameRoom ? "User already here" : undefined

        if (!errors.username) {
            this.props.invitePlayer(values.username)
        } else {
            throw new SubmissionError(errors)
        }
    }
    shouldRenderCountdown() {
        const hasTheTimerStarted = this.timer
        const isEveryoneReady = this.arePlayersReadyToStart()

        if (isEveryoneReady && !hasTheTimerStarted) {
            this.timer = setInterval(this.handleTimer, 1000)

            return true
        } else if (!isEveryoneReady && hasTheTimerStarted) {
            this.timer = clearInterval(this.timer)
            this.setState({ timeLeft: 3 })
        }

        return false
    }
    render() {
        return (
            <Background>
                { this.shouldRenderCountdown() && this.renderCountdown() }
                <Field
                    searchBar
                    name="username"
                    type="text"
                    containerStyle={{ width: 280 }}
                    inputStyle={{ color: "white" }}
                    icon={{ color: "white" }}
                    component={ Input }
                    placeholder="Invite user..." />
                <MenuItem onPress={ this.props.handleSubmit(this.validate) }>Invite</MenuItem>
                { this.renderPlayers() }
            </Background>
        )
    }
    renderPlayers() {
        return this.props.players.map(player =>
            (<InvitedPlayerView key={ player.username }>
                <CheckBox
                    center
                    title={ (<Player player={ player } />) }
                    iconRight
                    iconType="material"
                    checkedIcon="clear"
                    uncheckedIcon="add"
                    checkedColor="red"
                    checked={ player.isReady }
                    onPress={ !player.isReady ?
                        this.props.playerReady :
                        this.props.playerNotReady
                    } />
            </InvitedPlayerView>)
        )
    }
    renderCountdown() {
        return (
            <Countdown>
                <TimeLeft>{ this.state.timeLeft }</TimeLeft>
            </Countdown>
        )
    }
}

function mapStateToProps(state) {
    return {
        myUsername: userSelectors.getUsername(state),
        players: simonGameSelectors.getPlayers(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...navigatorActions, ...simonGameActions }, dispatch)
}

InvitePlayersScreen.propTypes = {
    cancelPrivateMatch: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invitePlayer: PropTypes.func.isRequired,
    myUsername: PropTypes.string.isRequired,
    players: PropTypes.array.isRequired,
    playerReady: PropTypes.func.isRequired,
    playerNotReady: PropTypes.func.isRequired
}

export default reduxForm({
    form: "invitePlayer"
})(connect(mapStateToProps, mapDispatchToProps)(InvitePlayersScreen))
