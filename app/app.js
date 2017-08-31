import React from "react"

import store from "./store"
import { Provider } from "react-redux"
import StartingScreen from "./screens/StartingScreen"

export default class App extends React.Component {
    render() {
        console.log(this.props)

        return (
            <Provider store={ store }>
                <StartingScreen />
            </Provider>
        )
    }
}
