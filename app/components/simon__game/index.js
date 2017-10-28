import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import SimonPad from "../simon__pad"
import { SINGLE_PLAYER_GAME } from "../../constants"

const SIMON_GAME_DIAMETER = 320
const BOARD_COLOR = "#020202"

const SimonGameContainer = styled.View`
    width: ${SIMON_GAME_DIAMETER}px;
    height: ${SIMON_GAME_DIAMETER}px;
    background-color: ${ BOARD_COLOR };
    border-radius: ${SIMON_GAME_DIAMETER / 2};
    align-items: center;
    justify-content: center;
    position: relative;
`
const BlackContainer = styled.View`
    width:${(SIMON_GAME_DIAMETER + 30)};
    height:${(SIMON_GAME_DIAMETER + 30)};
    border-radius: ${(SIMON_GAME_DIAMETER + 30) / 2};    
    background-color: ${ BOARD_COLOR };
    align-items: center;
    justify-content: center;
`
const Bar = styled.View`
    backgroundColor: ${ BOARD_COLOR };
    position: absolute;
    z-index: 20;
`
const VerticleBar = styled(Bar)`
    height: ${SIMON_GAME_DIAMETER};
    width: 30;
`
const HorizontalBar = styled(Bar)`
    height: 30;
    width: ${SIMON_GAME_DIAMETER};
`
const Center = styled.View`
    width: ${SIMON_GAME_DIAMETER * .30}px;
    height: ${SIMON_GAME_DIAMETER * .30}px;
    border-radius: ${SIMON_GAME_DIAMETER / 2};    
    background-color: ${ BOARD_COLOR };
    position: absolute;
    align-items: center;
    justify-content: center;
    z-index: 20;
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
        this.props.onPress(pad)
    }
    render() {
        //Pads that come from this.props are used to animate the moves of opponents in
        //online matches. Pads from this.state are used on the clients side to optimize
        //the animations speed and responsivensss.
        const { pads, isScreenDarkened } = this.props
        const { pad0, pad1, pad2, pad3 } = this.state

        return (
            <SimonGameContainer>

                <Center>
                    <Round>{ this.props.round }</Round>
                </Center>

                <SimonPad
                    style={{top: 0, left: 0}}
                    index={ 0 }
                    source={ pad0.isAnimating || pads[0].isAnimating ?
                        require("../../assets/images/top_left_pad_active.png") :
                        require("../../assets/images/top_left_pad.png")
                    }
                    isAnimating={ pad0.isAnimating || pads[0].isAnimating }
                    onPress={ () => this.handlePadPress(0) }
                    onPressIn={ () => this.setState({ pad0: { isAnimating: true } })}
                    onPressOut={ () => this.setState({ pad0: { isAnimating: false }}) } />

                <SimonPad
                    style={{top: 0, right: 0}}
                    index={ 1 }
                    source={ pad1.isAnimating || pads[1].isAnimating ?
                        require("../../assets/images/top_right_pad_active.png") :
                        require("../../assets/images/top_right_pad.png")
                    }
                    isAnimating={ pad1.isAnimating || pads[1].isAnimating }
                    onPress={ () => this.handlePadPress(1) }
                    onPressIn={ () => this.setState({ pad1: { isAnimating: true } })}
                    onPressOut={ () => this.setState({ pad1: { isAnimating: false }}) } />

                <SimonPad
                    style={{bottom: 0, left: 0}}
                    index={ 2 }
                    source={ pad2.isAnimating || pads[2].isAnimating ?
                        require("../../assets/images/bottom_left_pad_active.png") :
                        require("../../assets/images/bottom_left_pad.png")
                    }
                    isAnimating={ pad2.isAnimating || pads[2].isAnimating }
                    onPress={ () => this.handlePadPress(2) }
                    onPressIn={ () => this.setState({ pad2: { isAnimating: true } })}
                    onPressOut={ () => this.setState({ pad2: { isAnimating: false }}) } />

                <SimonPad
                    style={{bottom: 0, right: 0}}
                    index={ 3 }
                    source={ pad3.isAnimating || pads[3].isAnimating ?
                        require("../../assets/images/bottom_right_pad_active.png") :
                        require("../../assets/images/bottom_right_pad.png")
                    }
                    isAnimating={ pad3.isAnimating || pads[3].isAnimating }
                    onPress={ () => this.handlePadPress(3) }
                    onPressIn={ () => this.setState({ pad3: { isAnimating: true } })}
                    onPressOut={ () => this.setState({ pad3: { isAnimating: false }}) } />

                <TintedBG show={ isScreenDarkened } />
            </SimonGameContainer>
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
