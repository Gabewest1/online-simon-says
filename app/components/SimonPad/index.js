import React from "react"
import { Animated, InteractionManager, TouchableWithoutFeedback } from "react-native"
import PropTypes from "prop-types"

class Pad extends React.Component {
    constructor() {
        super()
        this.state = {
            opacity: new Animated.Value(1)
        }
    }
    onPressIn() {
        this.setOpacityTo(.2, 50)
        this.props.onPress()
    }
    onPressOut() {
        this.setOpacityTo(1, 1)
    }
    setOpacityTo(value, duration) {
        console.log("SET OPACITY TO")
        Animated.timing(
            this.state.opacity,
            {
                toValue: value,
                duration,
                useNativeDriver: true
            }
        ).start();
    }
    render() {
        const { activeOpacity, key, onPress, style } = this.props
        console.log("I AM RENDERING!")

        return (
            <Animated.View
                key={ key }
                onTouchStart={ () => this.onPressIn() }
                onTouchEnd={ () => this.onPressOut(1, 1) }
                style={ [ style, { opacity: this.state.opacity }] } />
        )
    }
}

Pad.propTypes = {
    onPress: PropTypes.func.isRequired
}

export default Pad
