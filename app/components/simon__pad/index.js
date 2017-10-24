import React from "react"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import Sound from "react-native-sound"

Sound.setCategory("Playback")

const pad0Audio = new Sound("a_sharp.wav", Sound.MAIN_BUNDLE, (err) => err && console.log(err))
const pad1Audio = new Sound("c_sharp.wav", Sound.MAIN_BUNDLE, (err) => err && console.log(err))
const pad2Audio = new Sound("d_sharp.wav", Sound.MAIN_BUNDLE, (err) => err && console.log(err))
const pad3Audio = new Sound("f_sharp.wav", Sound.MAIN_BUNDLE, (err) => err && console.log(err))

const padAudioFiles = {
    0: pad0Audio,
    1: pad1Audio,
    2: pad2Audio,
    3: pad3Audio
}

const PadView = styled.Image`
    max-width: 100%;
    max-height: 100%;
    height: ${320 / 2};
    width: ${320 / 2};
    ${({ isAnimating, index }) => {
        if (isAnimating) {
            playAudio(index)

            return "z-index: 2;"
        }
    }}
`

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
