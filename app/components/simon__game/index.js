import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import SimonPad from "../simon__pad"

const SimonGameContainer = styled.View`
    width: 320px;
    height: 320px;
    border-radius: ${320 / 2};
    align-items: center;
    justify-content: center;
    position: relative;
`

class SimonGame extends React.Component {
    render() {
        const { pads } = this.props

        return (
            <SimonGameContainer>
                <SimonPad
                    style={{top: 0, left: 0}}
                    source={ require("../../assets/images/game-pad-red.png") }
                    isAnimating={ pads[0].isAnimating }
                    onPress={ this.props.onPress } />
                <SimonPad
                    style={{top: 0, right: 0}}
                    source={ require("../../assets/images/game-pad-green.png") }
                    isAnimating={ pads[1].isAnimating }
                    onPress={ this.props.onPress } />
                <SimonPad
                    style={{bottom: 0, left: 0}}
                    source={ require("../../assets/images/game-pad-yellow.png") }
                    isAnimating={ pads[2].isAnimating }
                    onPress={ this.props.onPress } />
                <SimonPad
                    style={{bottom: 0, right: 0}}
                    source={ require("../../assets/images/game-pad-blue.png") }
                    isAnimating={ pads[3].isAnimating }
                    onPress={ this.props.onPress } />
            </SimonGameContainer>
        )
    }
}

SimonGame.propTypes = {
    onPress: PropTypes.func.isRequired,
    pads: PropTypes.array.isRequired
}

export default SimonGame
