import React from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"
import { SECONDARY_COLOR } from "../../constants"

const width = Dimensions.get("window").width * .45

const Container = styled.View`
    align-items: center;
`
const Text = styled.Text`
    color: ${ SECONDARY_COLOR };
    font-size: ${ Dimensions.get("window").width >= 600 ? 56 : 36 };
    font-weight: 900;
`
const SimonLogo = styled.Image`
   width: ${ width };
   height: ${ width };
`

class SimonSaysLogo extends React.Component {
    render() {
        return (
            <Container style={ this.props.style }>
                <SimonLogo source={ require("../../assets/images/ic_launcher.png") } />
                <Text>Cimon Online</Text>
            </Container>
        )
    }
}

export default SimonSaysLogo
