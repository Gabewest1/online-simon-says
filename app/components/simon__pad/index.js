import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"

const PadView = styled.Image`
    max-width: 100%;
    max-height: 100%;
    height: ${320 / 2};
    width: ${320 / 2};
    ${({ isAnimating }) => {
        if (isAnimating) {
            console.log("I SHOULD BE ANIMATING")
        }
        return isAnimating && "border-width: 5px; border-color: black;"
    }}
`

const Touchable = styled.TouchableOpacity`
    position: absolute;
    height: ${320 / 2};
    width: ${320 / 2};
`

class Pad extends React.Component {
    render() {
        return (
            <Touchable style={ this.props.style } onPress={ this.props.onPress }>
                <PadView { ...this.props } />
            </Touchable>
        )
    }
}

Pad.propTypes = {
    source: PropTypes.any.isRequired,
    onPress: PropTypes.func.isRequired
}

export default Pad
