import React from "react"
import styled from "styled-components/native"
import Circle from "../Circle"

const Container = styled.View`
    flex-direction: row;
`
const SimonText = styled.Text`
    font-size: 80px;
`

class SimonSaysLogo extends React.Component {
    render() {
        return (
            <Container>
                {/* <Circle style={{position: "absolute"}} color="red" left="0" top="5" radius={ 35 } />
                <Circle style={{position: "absolute"}} color="green" left="22" top="90" radius={ 50 } />
                <Circle style={{position: "absolute"}} color="blue" left="52" top="5" radius={ 42 } />
                <Circle style={{position: "absolute"}} color="yellow" left="90" top="90" radius={ 30 } /> */}
                <SimonText>Simon</SimonText>
            </Container>
        )
    }
}

export default SimonSaysLogo
