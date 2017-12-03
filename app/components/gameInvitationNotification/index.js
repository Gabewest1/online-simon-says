import React from "react"
import { Dimensions, TouchableOpacity, InteractionManager } from "react-native"
import PropTypes from "prop-types"
import styled from "styled-components/native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { Button } from "react-native-elements"

import Player from "../player"

import { actions as simonGameActions } from "../../redux/SimonSaysGame"

const Message = styled.View`
    backgroundColor: rgba(0,0,0,.6);
    width: ${ Dimensions.get("window").width };
    ${ () => {
        const width = Dimensions.get("window").width

        return width < 420 ? `
            flex-direction: column;
            justify-content: center;
            align-items: center;
        ` : `
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding-horizontal: 10;            
            padding-vertical: 10;            
        `
    }};
`
const PlayerSendingInvitationView = styled.View`
    ${ () => {
        const width = Dimensions.get("window").width

        return width < 420 ? `
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding-vertical: 15;
            width: 100%;
        ` : `
            flex-direction: row;
            align-items: center;
            justify-content: space-between;                        
        `
    }};
`
const Text = styled.Text`
    color: white;
    text-align: center;
    font-weight: 900; 
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
                <PlayerSendingInvitationView>
                    <Text>Game Inivatation From:</Text>
                    <Player
                        player={ player }
                        name= {{ style: { color: "white" } }}
                        icon={{ style: { marginHorizontal: 10 }}} />
                </PlayerSendingInvitationView>
                <Buttons>
                    <Button
                        Component={ TouchableOpacity }
                        backgroundColor="green"
                        raised
                        title="Accept"
                        onPress={ () => this.handleOnPress(playerAcceptedChallenge) } />
                    <Button
                        Component={ TouchableOpacity }
                        containerViewStyle={{ marginRight: 0 }}
                        backgroundColor="red"
                        raised
                        title="Decline"
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
