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

        this.validate = this.validate.bind(this)
        this.handleBack = this.handleBack.bind(this)

        props.navigator.setOnNavigatorEvent(this.handleBack)
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
    render() {
        return (
            <Background>
                <Field
                    searchBar
                    name="username"
                    type="text"
                    containerStyle={{ width: 280 }}
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
