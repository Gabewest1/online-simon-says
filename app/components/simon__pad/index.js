import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"

const PadView = styled.Image`
    max-width: 100%;
    max-height: 100%;
    height: ${320 / 2};
    width: ${320 / 2};
    ${({ isAnimating }) => isAnimating && "z-index: 2;"}
`

const Touchable = styled.TouchableOpacity`
    position: absolute;
    height: ${320 / 2};
    width: ${320 / 2};
    ${({ isAnimating }) => isAnimating && "z-index: 2;"}
`

class Pad extends React.Component {
    render() {
        return (
            <Touchable { ...this.props } activeOpacity={ 1 } >
                <PadView { ...this.props } />
            </Touchable>
        )
    }
}

Pad.propTypes = {
    source: PropTypes.any.isRequired,
    onPressIn: PropTypes.func.isRequired
}

export default Pad
