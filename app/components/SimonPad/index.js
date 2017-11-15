import React from "react"
import { InteractionManager, TouchableOpacity } from "react-native"
import PropTypes from "prop-types"

class Pad extends React.PureComponent {s
    render() {
        const { activeOpacity, key, onPress, style } = this.props
        console.log("I AM RENDERING!")

        return (
            <TouchableOpacity
                key={ key }
                style={ style }
                activeOpacity={ activeOpacity }
                onPressIn={ onPress } />
        )
    }
}

Pad.propTypes = {
    source: PropTypes.any.isRequired,
    onPress: PropTypes.func.isRequired
}

export default Pad
