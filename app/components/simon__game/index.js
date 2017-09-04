import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import SimonBoardPiece from "../simon__pad"

const SimonGameContainer = styled.View`
    width: 320px;
    height: 320px;
    border-radius: ${320 / 2};
    background-color: black;
    align-items: center;
    justify-content: center;
`

class SimonGame extends React.Component {
    render() {
        return (
            <SimonGameContainer>
                <SimonBoardPiece source={ require("../../assets/images/simon-pad-yellow.png") } />
                <SimonBoardPiece source={ require("../../assets/images/simon-pad-green.png") } />
                <SimonBoardPiece source={ require("../../assets/images/simon-pad-red.png") } />
                <SimonBoardPiece source={ require("../../assets/images/simon-pad-blue.png") } />
            </SimonGameContainer>
        )
    }
}

export default SimonGame
