import React from "react"
import { Dimensions } from "react-native"
import { Button } from "react-native-elements"
import { BACKGROUND_COLOR } from "../../constants"

class MenuItem extends React.Component {
    render() {
        const { children, icon, inverted, fontSize, onPress, style, title } = this.props

        const borderStyles = {
            borderColor: inverted ? BACKGROUND_COLOR : "white",
            borderRadius: 30,
            borderWidth: .3
        }

        const width = Dimensions.get("window").width

        const FONT_SIZE = fontSize
            || width > 500 ? 26
            : 18

        const color = inverted ? BACKGROUND_COLOR : "white"

        return (
            <Button
                raised
                fontSize={ FONT_SIZE }
                color={ color }
                backgroundColor={ inverted ? "white" : BACKGROUND_COLOR }
                icon={{ ...icon, style: { position: "absolute", left: "10%", color, fontSize: FONT_SIZE } }}
                buttonStyle={{
                    ...borderStyles,
                    marginLeft: 0,
                    marginRight: 0
                }}
                containerViewStyle={{ ...style, ...borderStyles, marginLeft: 0, marginRight: 0 }}
                title={ children || title }
                onPress={ onPress } />
        )
    }
}

export default MenuItem
