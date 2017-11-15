import React from "react"
import PropTypes from "prop-types"
import { Dimensions, Keyboard, TouchableOpacity, InteractionManager, Text, View } from "react-native"
import { Icon, SearchBar } from "react-native-elements"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import { reduxForm, Field, SubmissionError } from "redux-form"

import Player from "../../components/player"
import Background from "../../components/background"
import MenuItem from "../../components/menu-item"
import Input from "../../components/input"

import { SECONDARY_COLOR } from "../../constants"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

import { actions as navigatorActions } from "../../redux/Navigator"

import { selectors as userSelectors } from "../../redux/Auth"

const FONT_SIZE = Dimensions.get("window").width < 480
    ? 18 : 24

const InvitePlayerForm = styled.View`
    paddingVertical: ${ FONT_SIZE * .7 };
`
const PlayersView = styled.View`
    flex-grow: 1;
`
const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    marginVertical: ${ FONT_SIZE * .7 };
    paddingVertical: ${ FONT_SIZE * .35 };
    border-color: ${ SECONDARY_COLOR };
    border-bottom-width: 2;
`
const InvitedPlayerView = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${ FONT_SIZE * .7 };
`

const styles = {
    width: Dimensions.get("window").width * .8
}

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

        //I track isReady locally to quickly animate the ready icon b/c otherwise i have to wait
        //for the server to respond and update my state. 
        this.state = { isReady: this.getMyPlayer().isReady }

        props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    getMyPlayer = () => {
        const { players, myUsername } = this.props

        return players.find(player => player.username === myUsername)
    }
    handleBack = ({ id }) => {
        if (id === "backPress" || id === "quit") {
            console.log("EXIT ACTION:", this.props)
            this.props.showBackoutWarningMessage({
                stay: { type: "STAY", onPress: this.props.stay },
                exit: { type: "CANCEL_PRIVATE_MATCH", onPress: this.props.cancelPrivateMatch }
            })
        }
    }
    togglePlayerReady = player => {
        InteractionManager.runAfterInteractions(() => {
            if (player.username === this.props.myUsername) {
                if (!player.isReady) {
                    this.props.playerReady()
                    this.setState({ isReady: true })
                } else {
                    this.props.playerNotReady()
                    this.setState({ isReady: false })
                }
            }
        })
    }
    validate = values => {
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
            <Background around>
                <InvitePlayerForm>
                    <Field
                        searchBar
                        containerStyle={{ width: styles.width }}
                        name="username"
                        type="text"
                        component={ Input }
                        placeholder="Invite user..." />
                    <MenuItem
                        style={{ width: styles.width }}
                        onPress={ this.props.handleSubmit(this.validate) }>
                        Invite
                    </MenuItem>
                </InvitePlayerForm>
                <PlayersView>
                    <Header>
                        <View>
                            <Text style={{ fontSize: FONT_SIZE }}>Players</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: FONT_SIZE }}>Ready</Text>
                        </View>
                    </Header>
                    { this.renderPlayers() }
                </PlayersView>
            </Background>
        )
    }
    renderPlayers() {
        return this.props.players.map(player =>
            (<InvitedPlayerView style={{ width: styles.width }} key={ player.username }>
                <Player player={ player } />
                <TouchableOpacity
                    activeOpacity={ player.username === this.props.myUsername ? .2 : 1 }
                    onPress={ () => this.togglePlayerReady(player) }>
                    <Icon
                        type="material"
                        name={ player.isReady ? "done" : "clear" }
                        color={ player.isReady ? "green" : "red" } />
                </TouchableOpacity>
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
