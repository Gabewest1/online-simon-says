import React from "react"
import { Animated, InteractionManager, TouchableWithoutFeedback } from "react-native"
import PropTypes from "prop-types"

class Pad extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hasLayoutBeenSet: false,
            coordinates: {},
            isAnimating: false,
            opacity: new Animated.Value(1)
        }
    }
    render() {
        const { activeOpacity, activeTouch, onPress, style } = this.props

        return (
            <Animated.View
                ref="pad"
                onLayout={ this.setCoordinates }
                style={ [ style, { opacity: this.state.opacity }] } />
        )
    }
    componentWillReceiveProps(nextProps) {
        let wasPressed = this.wasPadPressed(nextProps.activeTouch)

        if (wasPressed) {
            this.onPressIn()
        }
    }
    shouldComponentUpdate() {
        return this.props.isScreenDarkened
    }
    wasPadPressed(activeTouch) {
        const { x, y } = activeTouch
        const { height, width, left, top } = this.state.coordinates

        if (!left || !top) {
            return
        }

        const minX = left
        const maxX = minX + width
        const minY = top
        const maxY = minY + height

        const isBetweenTheBound = (lower, higher, val) => lower <= val && val <= higher

        return isBetweenTheBound(minX, maxX, x) && isBetweenTheBound(minY, maxY, y)
    }
    onPressIn = () => {
        this.setOpacityTo(.2, 100, this.onPressOut)
    }
    onPressOut = () => {
        this.setOpacityTo(1, 75)
        this.props.onPress()
    }
    setOpacityTo(value, duration, cb) {
        Animated.timing(
            this.state.opacity,
            {
                toValue: value,
                duration,
                useNativeDriver: true
            }
        ).start(cb);
    }
    setCoordinates = () => {
        if (!this.state.hasLayoutBeenSet) {
            this.refs.pad._component.measure( (fx, fy, w, h, px, py) => {
                this.setState({ hasLayoutBeenSet: true, coordinates: { height: h, width: w, left: px, top: py } })
            })
        }
    }
}

Pad.propTypes = {
    onPress: PropTypes.func.isRequired
}

export default Pad
