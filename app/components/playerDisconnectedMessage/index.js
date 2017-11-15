import React from "react"
import styled from "styled-components/native"

const Message = styled.View`
    justify-content: center;
    align-items: center;
    backgroundColor: rgba(0,0,0,.6);
    width: 100%;
`
const Text = styled.Text`
    color: white;
    text-align: center;
    padding-top: 15;
    padding-bottom: 15;    
`

export default PlayerDisconnectMessage = props => {
    console.log("PROPSSSSSSSSS:", props)

    return (
        <Message>
            <Text>{ props.player.username } disconnected</Text>
        </Message>
    )
}
