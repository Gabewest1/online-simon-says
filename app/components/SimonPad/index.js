import React from "react"
import { Animated, InteractionManager, TouchableWithoutFeedback } from "react-native"
import PropTypes from "prop-types"

class Pad extends React.Component {
    constructor(props) {
        super(props)
        console.log("IN THE CONSTRUCTOR OF THE PAD")
        this.state = {
            coordinates: {},
            isAnimating: false,
            opacity: new Animated.Value(1)
        }
    }
    render() {
        const { activeOpacity, activeTouch, onPress, style } = this.props
        // console.log("I AM RENDERING!")

        return (
            <Animated.View
                ref="pad"
                onLayout={ this.setCoordinates }
                style={ [ style, { opacity: this.state.opacity }] } />
        )
    }
    componentWillReceiveProps(nextProps) {
        if (this.wasPadPressed(nextProps.activeTouch) && !this.state.isAnimating) {
            this.setState({ isAnimating: true })
            this.onPressIn()
        } else if (!this.wasPadPressed(nextProps.activeTouch) && this.state.isAnimating) {
            this.setState({ isAnimating: false })
            this.onPressOut()
        }
    }
    wasPadPressed(activeTouch) {
        const { x, y } = activeTouch
        const { height, width, left, top } = this.state.coordinates

        if (!left || !top) {
            console.log("POSITION HASN'T BEEN SET")
            return
        }

        const minX = left
        const maxX = minX + width
        const minY = top
        const maxY = minY + height

        const isBetweenTheBound = (lower, higher, val) => lower <= val && val <= higher

        // console.log("X,Y:", x, y)
        // console.log("W,H:", width, height)
        // console.log("L,T:", minX, minY)
        // console.log("BETWEEN BOUNDS:", isBetweenTheBound(minX, maxX, x) && isBetweenTheBound(minY, maxY, y))

        return isBetweenTheBound(minX, maxX, x) && isBetweenTheBound(minY, maxY, y)
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
    setCoordinates = () => {
        console.log("ASSIGNING POSITION", this)
        this.refs.pad._component.measure( (fx, fy, w, h, px, py) => {
            console.log('X offset to page: ' + px)
            console.log('Y offset to page: ' + py)
            this.setState({ coordinates: { height: h, width: w, left: px, top: py } })
        })
    }
}

Pad.propTypes = {
    onPress: PropTypes.func.isRequired
}

export default Pad
