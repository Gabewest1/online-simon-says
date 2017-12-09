import React, { Component } from 'react';
import {
    Dimensions,
    InteractionManager,
    PanResponder,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import SimonPad from "../SimonPad"

const Sound = require('react-native-sound');

const pad1Audio = new Sound("simon_sound1.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))
const pad2Audio = new Sound("simon_sound2.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))
const pad3Audio = new Sound("simon_sound3.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))
const pad4Audio = new Sound("simon_sound4.mp3", Sound.MAIN_BUNDLE, err => err && console.log(err))

const padAudioFiles = {
    1: pad1Audio,
    2: pad2Audio,
    3: pad3Audio,
    4: pad4Audio
}

function playAudio(index) {
    const audio = padAudioFiles[index]
    // console.log("AUDIO::::", index, audio)

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

const { width, height } = Dimensions.get('window');
const SIZE = 2; // two-by-two grid
const CELL_SIZE = Math.floor(width * .4); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .02); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 2;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = 50;

class BoardView extends Component {
    constructor(props) {
        super(props)

        this.tiles = []
        this.state = {lit: 0, activeTouch: { x: -1, y: -1 }, numTouches: 0 }
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                if (!this.props.isScreenDarkened) {
                    this.setActiveTouch(evt, gestureState)
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!this.props.isScreenDarkened) {
                    this.setActiveTouch(evt, gestureState)
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
            // console.log("TOUCHES DONEEEEEEEEEEEEEEEEEEEEEEEEE")
                this.setState({ activeTouch: { x: -1, y: -1 }, numTouches: 0 })
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // console.log("TERMINATING")
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            }
        })
    }
    setActiveTouch(evt, gestureState) {
        const touches = evt.touchHistory.touchBank

        let activeTouch = touches[0]
        let activeTouches = 0

        for (let i = 0; i < touches.length; i++) {
            let touch = touches[i]

            if (touch.touchActive) {
                activeTouches++

                if (activeTouch.startTimeStamp <= touch.startTimeStamp) {
                    activeTouch = touch
                }
            }
        }

        // const activeTouches = touches.filter(touch => touch.touchActive)

        // const activeTouch = activeTouches.reduce((highest, current) => highest.startTimeStamp <= current.startTimeStamp ? current : highest, { startTimeStamp: 0 })

        // console.log("Active Touch:", activeTouch)
        // console.log(activeTouches.length, this.state.numTouches)

        const { startPageX: x, startPageY: y } = activeTouch

        //Should reset the active touch if there is less touches now than previously.
        if (activeTouches < this.state.numTouches) {
            this.setState({ activeTouch: { x: -1, y: -1 }, numTouches: this.state.numTouches - 1 })
        } else if (activeTouches > this.state.numTouches) {
            this.setState({ activeTouch: { x, y }, numTouches: this.state.numTouches + 1 })
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const tileWasPressed = this.props.lit !== nextProps.lit || this.state.lit !== nextState.lit
        const onPressDisabledChanged = this.props.disableOnPress !== nextProps.disableOnPress
        const movesArrayIncreased = this.props.numberOfMoves !== nextProps.numberOfMoves
        const newActiveTouch = this.state.activeTouch !== nextState.activeTouch
        const numTouchesChanged = this.state.numTouches !== nextState.numTouches

        return tileWasPressed || onPressDisabledChanged || movesArrayIncreased || newActiveTouch || numTouchesChanged
    }

    render() {
        console.log("RENDERING BOARD VIEW!!!!!")

        return (
            <View { ...this._panResponder.panHandlers } style={ styles.container }>
                {this.renderPads()}
            </View>
        )
    }

    // create four tiles
    renderPads() {
        let result = [];
        let i = 1;
        let bgColors = ["", "", "#3275DD", "#D93333", "#64D23B", "#FED731", "black"];
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                let position = {
                    left: col * CELL_SIZE + CELL_PADDING,
                    top: row * CELL_SIZE + CELL_PADDING
                };
                result.push(this.renderPad(i++, position, bgColors[i], 'white'));
            }
        }

        return result;
    }

    // create one tile
    renderPad(id, position, bgColor, litBgColor) {

        //Is true when playing back the moves to the player or 
        //in a multiplayer game and the opponents plays a move
        if (this.props.lit === id) {
            playAudio(this.props.lit)
        }

        const isLit = this.props.lit || this.state.lit
        const backgroundColor = isLit == id ? litBgColor : bgColor

        return (
            <SimonPad
                key={ id }
                style={ [ styles.tile, position, { backgroundColor } ] }
                activeTouch={ this.state.activeTouch }
                activeOpacity={ this.props.disableOnPress ? 1 : .2 }
                isScreenDarkened={ this.props.isScreenDarkened }
                onPress={ () => !this.props.disableOnPress && this._onPress(id) } />
        )
    }

    _onPress(id) {
        // playAudio(id)
        // InteractionManager.runAfterInteractions(() => {
        //     this.props.onPress(id)
        // })
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: CELL_SIZE * SIZE,
        height: CELL_SIZE * SIZE,
        backgroundColor: 'transparent',
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap"
    },
    tile: {
        position: 'absolute',
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: BORDER_RADIUS,
        justifyContent: 'center',
        alignItems: 'center'
    },
    letter: {
        color: 'white',
        fontSize: LETTER_SIZE,
        backgroundColor: 'transparent',
        borderRadius: BORDER_RADIUS,
        textAlign: 'center'
    }
});

export default BoardView
