import React from "react"
import { Dimensions } from "react-native"
import { Button } from "react-native-elements"
import { BACKGROUND_COLOR, SECONDARY_COLOR } from "../../constants"

class MenuItem extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            debouncing: false,
            debounceTime: 2000
        }
    }
    debounceDecorator = (fn) => () => {
        if (!this.state.debouncing) {
            fn()
            this.setState({ debouncing: true })
            setTimeout(
                () => this.setState({ debouncing: false }),
                this.state.debounceTime
            )
        }
    }
    render() {
        const { children, icon, inverted, fontSize, onPress, style, title } = this.props

        const borderStyles = {
            borderColor: inverted ? BACKGROUND_COLOR : SECONDARY_COLOR,
            borderRadius: 30,
            borderWidth: 1
        }

        const width = Dimensions.get("window").width

        const FONT_SIZE = fontSize
            || width > 500 ? 26
            : 18

        const color = inverted ? BACKGROUND_COLOR : SECONDARY_COLOR

        return (
            <Button
                raised
                fontSize={ FONT_SIZE }
                color={ color }
                backgroundColor={ inverted ? SECONDARY_COLOR : BACKGROUND_COLOR }
                icon={{ ...icon, style: { position: "absolute", left: "10%", color, fontSize: FONT_SIZE } }}
                buttonStyle={{
                    ...borderStyles,
                    marginLeft: 0,
                    marginRight: 0
                }}
                containerViewStyle={{ ...style, ...borderStyles, marginLeft: 0, marginRight: 0 }}
                title={ children || title }
                onPress={ this.debounceDecorator(onPress) } />
        )
    }
}

export default MenuItem
