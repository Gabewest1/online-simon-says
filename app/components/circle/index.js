import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"

export default class Circle extends React.Component {
    render() {
        let {
            left, top, color, radius, style
        } = this.props

        return (
            <CircleView
                style={ style }
                color={ color }
                radius={ radius }
                left={ left }
                top={ top } />
        )
    }
}

const CircleView = styled.View`
    width: ${({ radius }) => radius};
    height: ${({ radius }) => radius};
    border-radius: ${({ radius }) => radius / 2};
    backgroundColor: ${props => props.color};
    ${({ top, left }) => {
        return `top: ${top}; left: ${left};`
    }
    }
`

Circle.propTypes = {
    color: PropTypes.string.isRequired,
    radius: PropTypes.number.isRequired,
    style: PropTypes.object,
    left: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    top: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}
