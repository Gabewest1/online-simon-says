import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import store from "./store"
import { Provider } from "react-redux"
import MenuItem from "./components/MenuItem"
import SimonSaysLogo from "./components/shared/SimonSaysLogo"

const Container = styled.View`
    justify-content: space-around;
    align-items: center;
    height: 100%;
    padding-bottom: 100px;
`

export default class App extends React.Component {
    render() {
        console.log(this.props)

        return (
            <Provider store={ store }>
                <Container>
                    <SimonSaysLogo />
                    <View style={{width: "80%"}}>
                        <MenuItem color={ "red" }>
                            Sign-up
                        </MenuItem>
                        <MenuItem color={ "blue" }>
                            Login
                        </MenuItem>
                        <MenuItem color={ "green" }>
                            Play as a guest
                        </MenuItem>
                    </View>
                </Container>
            </Provider>
        )
    }
}
