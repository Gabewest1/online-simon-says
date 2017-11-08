import React from "react"
import { InteractionManager } from "react-native"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import Sound from "react-native-sound"

Sound.setCategory("Playback")

const pad0Audio = new Sound("simon_sound1.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))
const pad1Audio = new Sound("simon_sound2.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))
const pad2Audio = new Sound("simon_sound3.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))
const pad3Audio = new Sound("simon_sound4.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))

const padAudioFiles = {
    0: pad0Audio,
    1: pad1Audio,
    2: pad2Audio,
    3: pad3Audio
}

function playAudio(padIndex) {
    const audio = padAudioFiles[padIndex]
    console.log("AUDIO:", padIndex, audio)
    audio.getCurrentTime(time => {
        if (time > 0) {
            audio.stop(() => {
                audio.play()
            })
        } else {
            audio.play()
        }
    })

}
const PadsView = styled.View`
    position: relative;    
`
const Container = styled.View`
    position: absolute;    
`
const PadStyle = styled.Image`
    max-width: 100%;
    max-height: 100%;
    height: ${320 / 2};
    width: ${320 / 2};
`
const PadView = styled(PadStyle)`
    position: absolute;
    ${({ isAnimating, index }) => {
        if (isAnimating) {
            playAudio(index)

            return "z-index: 2;"
        }
    }}
`
const PadViewActive = styled(PadStyle)`
    position: absolute;
`

const Touchable = styled.TouchableOpacity`
    position: absolute;
    height: ${320 / 2};
    width: ${320 / 2};
    ${({ isAnimating }) => isAnimating && "z-index: 2;"}
`

class Pad extends React.PureComponent {
    onPress() {
        InteractionManager.runAfterInteractions(() => {
            this.props.onPress()
        })
    }
    render() {
        const { disableOnPress, source, sourceActive } = this.props

        return (
            <Container style={ this.props.style }>
                <PadsView>
                    <PadViewActive style={ this.props.style } source={ sourceActive } />

                    <Touchable
                        { ...this.props }
                        activeOpacity={ disableOnPress ? 1 : .2 }
                        onPress={ !disableOnPress && this.onPress.bind(this) }
                        onPressIn={ () => !disableOnPress && playAudio(this.props.index) }>

                        <PadView { ...this.props } source={ source } />

                    </Touchable>

                </PadsView>
            </Container>
        )
    }
}

Pad.propTypes = {
    source: PropTypes.any.isRequired,
    onPress: PropTypes.func.isRequired
}

export default Pad
