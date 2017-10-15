import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import SimonPad from "../simon__pad"
import { SINGLE_PLAYER_GAME } from "../../constants"
const SIMON_GAME_DIAMETER = 320

const SimonGameContainer = styled.View`
    width: ${SIMON_GAME_DIAMETER}px;
    height: ${SIMON_GAME_DIAMETER}px;
    background-color: black;
    border-radius: ${SIMON_GAME_DIAMETER / 2};
    align-items: center;
    justify-content: center;
    position: relative;
`
const BlackContainer = styled.View`
    width: 330px;
    height: 330px;
    border-radius: ${(SIMON_GAME_DIAMETER + 10) / 2};    
    background-color: black;
    align-items: center;
    justify-content: center;
`
const Center = styled.View`
    width: ${SIMON_GAME_DIAMETER * .35}px;
    height: ${SIMON_GAME_DIAMETER * .35}px;
    border-radius: ${SIMON_GAME_DIAMETER / 2};    
    background-color: black;
    position: absolute;
    align-items: center;
    justify-content: center;
    z-index: 8;
`
const Round = styled.Text`
    color: white;
`
const TintedBG = styled.View`
    backgroundColor: rgba(0,0,0,.5);
    border-radius: ${SIMON_GAME_DIAMETER / 2};    
    height: ${SIMON_GAME_DIAMETER}px;
    position: absolute;
    width: ${SIMON_GAME_DIAMETER}px;

    ${({ show }) => {
        if (show) {
            return `
                z-index: 1;
                opacity: 1;
            `
        } else {
            return `
                z-index: -1;
                opacity: 0;
            `
        }
    }}
`
class SimonGame extends React.Component {
    constructor() {
        super()
        this.state = {
            pad0: { isAnimating: false },
            pad1: { isAnimating: false },
            pad2: { isAnimating: false },
            pad3: { isAnimating: false }
        }
    }
    handlePadPress(pad) {
        if (this.props.gameMode === SINGLE_PLAYER_GAME) {
            this.setState({ [`pad${pad}`]: { isAnimating: true }})
        }
        this.props.onPressIn(pad)
    }
    render() {
        //Pads that come from this.props are used to animate the moves of opponents in
        //online matches. Pads from this.state are used on the clients side to optimize
        //the animations speed and responsivensss.
        const { pads, isScreenDarkened } = this.props
        const { pad0, pad1, pad2, pad3 } = this.state

        return (
            <BlackContainer>
                <SimonGameContainer>

                    <Center>
                        <Round>{ this.props.round }</Round>
                    </Center>

                    <SimonPad
                        style={{top: 0, left: 0}}
                        source={ pad0.isAnimating || pads[0].isAnimating ?
                            require("../../assets/images/game-pad-red-active.png") :
                            require("../../assets/images/game-pad-red.png")
                        }
                        isAnimating={ pad0.isAnimating || pads[0].isAnimating }
                        onPressIn={ () => this.handlePadPress(0) }
                        onPressOut={ () => this.setState({ pad0: { isAnimating: false }}) } />

                    <SimonPad
                        style={{top: 0, right: 0}}
                        source={ pad1.isAnimating || pads[1].isAnimating ?
                            require("../../assets/images/game-pad-green-active.png") :
                            require("../../assets/images/game-pad-green.png")
                        }
                        isAnimating={ pad1.isAnimating || pads[1].isAnimating }
                        onPressIn={ () => this.handlePadPress(1) }
                        onPressOut={ () => this.setState({ pad1: { isAnimating: false }}) } />

                    <SimonPad
                        style={{bottom: 0, left: 0}}
                        source={ pad2.isAnimating || pads[2].isAnimating ?
                            require("../../assets/images/game-pad-yellow-active.png") :
                            require("../../assets/images/game-pad-yellow.png")
                        }
                        isAnimating={ pad2.isAnimating || pads[2].isAnimating }
                        onPressIn={ () => this.handlePadPress(2) }
                        onPressOut={ () => this.setState({ pad2: { isAnimating: false }}) } />

                    <SimonPad
                        style={{bottom: 0, right: 0}}
                        source={ pad3.isAnimating || pads[3].isAnimating ?
                            require("../../assets/images/game-pad-blue-active.png") :
                            require("../../assets/images/game-pad-blue.png")
                        }
                        isAnimating={ pad3.isAnimating || pads[3].isAnimating }
                        onPressIn={ () => this.handlePadPress(3) }
                        onPressOut={ () => this.setState({ pad3: { isAnimating: false }}) } />

                    <TintedBG show={ isScreenDarkened } />
                </SimonGameContainer>
            </BlackContainer>
        )
    }
}

SimonGame.propTypes = {
    gameMode: PropTypes.number.isRequired,
    isScreenDarkened: PropTypes.bool.isRequired,
    onPressIn: PropTypes.func.isRequired,
    pads: PropTypes.array.isRequired,
    round: PropTypes.number.isRequired
}

export default SimonGame
