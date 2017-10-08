import React from "react"
import styled from "styled-components/native"
import Circle from "../circle"

const Container = styled.View`
    flex-direction: row;
`
const SimonLogo = styled.Image`

`

class SimonSaysLogo extends React.Component {
    render() {
        return (
            <Container>
                <SimonLogo source={ require("../../assets/images/simon-logo.png") } />
            </Container>
        )
    }
}

export default SimonSaysLogo
