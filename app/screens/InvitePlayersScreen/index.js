import React from "react"
import PropTypes from "prop-types"
import { Keyboard } from "react-native"
import { SearchBar } from "react-native-elements"
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

class InvitePlayersScreen extends React.Component {
    constructor(props) {
        super(props)

        this.validate = this.validate.bind(this)
        this.handleBack = this.handleBack.bind(this)

        props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    handleBack({ id }) {
        if (id === "backPress") {
            this.props.showBackoutWarningMessage()
        }
    }
    validate(values) {
        Keyboard.dismiss()

        values.username = values.username.toLowerCase().trim()

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
            <Player player={ player } key={ player.username } />
        )
    }
}

function mapStateToProps(state) {
    return {
        players: simonGameSelectors.getPlayers(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...navigatorActions, ...simonGameActions }, dispatch)
}

InvitePlayersScreen.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    invitePlayer: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired
}

export default reduxForm({
    form: "invitePlayer"
})(connect(mapStateToProps, mapDispatchToProps)(InvitePlayersScreen))
