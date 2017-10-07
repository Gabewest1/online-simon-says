import React from "react"
import styled from "styled-components/native"
import Background from "../../components/background"

const Text = styled.Text`

`

class SinglePlayerGameOverScreen extends React.Component {
    render() {
        return (
            <Background>
                <Text>GameOver</Text>
            </Background>
        )
    }
}

export default SinglePlayerGameOverScreen
