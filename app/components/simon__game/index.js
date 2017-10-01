import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import SimonPad from "../simon__pad"

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
    render() {
        const { pads, isScreenDarkened } = this.props

        return (
            <BlackContainer>
                <SimonGameContainer>

                    <Center>
                        <Round>{ this.props.round }</Round>
                    </Center>

                    <SimonPad
                        style={{top: 0, left: 0}}
                        source={ pads[0].isAnimating ?
                            require("../../assets/images/game-pad-red-active.png") :
                            require("../../assets/images/game-pad-red.png")
                        }
                        isAnimating={ pads[0].isAnimating }
                        onPress={ () => this.props.onPress(0) } />
                    <SimonPad
                        style={{top: 0, right: 0}}
                        source={ pads[1].isAnimating ?
                            require("../../assets/images/game-pad-green-active.png") :
                            require("../../assets/images/game-pad-green.png")
                        }
                        isAnimating={ pads[1].isAnimating }
                        onPress={ () => this.props.onPress(1) } />
                    <SimonPad
                        style={{bottom: 0, left: 0}}
                        source={ pads[2].isAnimating ?
                            require("../../assets/images/game-pad-yellow-active.png") :
                            require("../../assets/images/game-pad-yellow.png")
                        }
                        isAnimating={ pads[2].isAnimating }
                        onPress={ () => this.props.onPress(2) } />
                    <SimonPad
                        style={{bottom: 0, right: 0}}
                        source={ pads[3].isAnimating ?
                            require("../../assets/images/game-pad-blue-active.png") :
                            require("../../assets/images/game-pad-blue.png")
                        }
                        isAnimating={ pads[3].isAnimating }
                        onPress={ () => this.props.onPress(3) } />

                    <TintedBG show={ isScreenDarkened } />
                </SimonGameContainer>
            </BlackContainer>
        )
    }
}

SimonGame.propTypes = {
    isScreenDarkened: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
    pads: PropTypes.array.isRequired,
    round: PropTypes.number.isRequired
}

export default SimonGame
