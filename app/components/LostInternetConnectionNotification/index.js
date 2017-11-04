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

export default LostInternetConnectionNotification = props => {
    return (
        <Message>
            <Text>Internet Connection has been Lost...</Text>
        </Message>
    )
}
