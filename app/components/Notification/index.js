import React from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"

const Message = styled.View`
    justify-content: center;
    align-items: center;
    backgroundColor: rgba(0,0,0,.6);
    width: ${ Dimensions.get("window").width };    
`
const Text = styled.Text`
    color: white;
    text-align: center;
    padding-top: 15;
    padding-bottom: 15;    
`

export default Notification = props => {
    return (
        <Message { ...props.container }>
            <Text { ...props.text }>{ props.message }</Text>
        </Message>
    )
}
