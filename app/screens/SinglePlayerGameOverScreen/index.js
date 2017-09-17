import React from "react"
import styled from "styled-components/native"

const Container = styled.View`


`
const Text = styled.Text`

`
class SinglePlayerGameOverScreen extends React.Component {
    render() {
        return (
            <Container>
                <Text>GameOver</Text>
            </Container>
        )
    }
}

export default SinglePlayerGameOverScreen
