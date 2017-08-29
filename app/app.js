import React from "react"
import styled from "styled-components/native"
import store from "./store"
import { Provider } from "react-redux"
import MenuItem from "./components/MenuItem"

const Container = styled.View`
    justify-content: flex-end;
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
                    <MenuItem color={ "red" }>
                        Sign-up
                    </MenuItem>
                    <MenuItem color={ "blue" }>
                        Login
                    </MenuItem>
                    <MenuItem color={ "green" }>
                        Play as a guest
                    </MenuItem>
                </Container>
            </Provider>
        )
    }
}
