import React from "react"
import { TouchableOpacity, InteractionManager } from "react-native"
import PropTypes from "prop-types"
import styled from "styled-components/native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { Button } from "react-native-elements"

import Player from "../player"

import { actions as simonGameActions } from "../../redux/SimonSaysGame"

const Message = styled.View`
    justify-content: center;
    align-items: center;
    backgroundColor: rgba(0,0,0,.6);
`
const Text = styled.Text`
    color: white;
    text-align: center;
    padding-top: 15;
    padding-bottom: 15;    
`
const Buttons = styled.View`
    flex-direction: row;
`

class GameInvitationNotification extends React.Component {
    handleOnPress(fn) {
        InteractionManager.runAfterInteractions(() => {
            fn()
        })
    }
    render() {
        const { player, playerAcceptedChallenge, playerDeclinedChallenge } = this.props

        return (
            <Message>
                <Player player={ player } />
                <Buttons>
                    <Button
                        Component={ TouchableOpacity }
                        backgroundColor="green"
                        title="Accept"
                        raised
                        onPress={ () => this.handleOnPress(playerAcceptedChallenge) } />
                    <Button
                        Component={ TouchableOpacity }
                        backgroundColor="red"
                        title="Decline"
                        raised
                        onPress={ () => this.handleOnPress(playerDeclinedChallenge) } />
                </Buttons>
            </Message>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions }, dispatch)
}

GameInvitationNotification.propTypes = {
    player: PropTypes.object.isRequired,
    playerAcceptedChallenge: PropTypes.func.isRequired,
    playerDeclinedChallenge: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInvitationNotification)
