import React from "react"
import styled from "styled-components/native"

import SimonGame from "../../components/simon__game"

const Container = styled.View`
    height: 100%;
    justify-content: center;
    align-items: center;
`

class SimonGameScreen extends React.Component {
    render() {
        return (
            <Container>
                <SimonGame { ...this.props } />
            </Container>
        )
    }
}

export default SimonGameScreen
