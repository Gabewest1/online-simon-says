import React from "react"
import { Keyboard, TouchableWithoutFeedback } from "react-native"

function onPress(onPressFromProps) {
    console.log("AYYYY ONPRESS")
    Keyboard.dismiss()

    if (onPressFromProps) {
        onPressFromProps()
    }
}

const CancelKeyboard = props => {
    return (
        <TouchableWithoutFeedback { ...props } onPress={ onPress.bind(this, props.onPress) }>
            { props.children }
        </TouchableWithoutFeedback>
    )
}

export default CancelKeyboard
