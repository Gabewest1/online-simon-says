import React from "react"
import { Button } from "react-native-elements"
import { BACKGROUND_COLOR } from "../../constants"

class MenuItem extends React.Component {
    render() {
        const borderStyles = {
            borderColor: "white",
            borderRadius: 10,
            borderWidth: .3
        }

        const { children, color, icon, onPress, style, title } = this.props

        return (
            <Button
                raised
                icon={{ ...icon, style: { position: "absolute", left: "10%" } }}
                buttonStyle={{ ...borderStyles, backgroundColor: BACKGROUND_COLOR, marginLeft: 0, marginRight: 0 }}
                containerViewStyle={{ ...style, ...borderStyles, marginLeft: 0, marginRight: 0 }}
                title={ children || title }
                onPress={ onPress } />
        )
    }
}

export default MenuItem
