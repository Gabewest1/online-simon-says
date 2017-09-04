import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"

const PadView = styled.Image`
    position: absolute;
    border-width: 2px;
    width: 100%;
    height: 100%;
`

class Pad extends React.Component {
    render() {
        let { source } = this.props

        console.log("Source:", source)

        return (
            <PadView source={ source } />
        )
    }
}

Pad.propTypes = {
    source: PropTypes.any.isRequired
}

export default Pad
