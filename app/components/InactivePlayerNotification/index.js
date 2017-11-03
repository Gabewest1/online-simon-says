import React from "react"
import styled from "styled-components/native"

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

export default InactivePlayerNotification = props => {
    return (
        <Message>
            <Text>You were kicked for inactivity.</Text>
        </Message>
    )
}
