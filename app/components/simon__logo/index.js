import React from "react"
import styled from "styled-components/native"

const Container = styled.View`

`
const SimonLogo = styled.Image`

`

class SimonSaysLogo extends React.Component {
    render() {
        return (
            <Container style={ this.props.style }>
                <SimonLogo source={ require("../../assets/images/simon_logo.png") } />
            </Container>
        )
    }
}

export default SimonSaysLogo
