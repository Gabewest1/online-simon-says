import React, { Component } from 'react';
import {
    Dimensions,
    InteractionManager,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

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
    console.log("AUDIO::::", index, audio)
    audio.getCurrentTime(time => {
        if (time > 0) {
            audio.stop(() => {
                audio.play()
            })
        } else {
            audio.play()
        }

        audio.release()
    })
}

const { width, height } = Dimensions.get('window');
const SIZE = 2; // two-by-two grid
const CELL_SIZE = Math.floor(width * .4); // 20% of the screen width
const CELL_PADDING = Math.floor(CELL_SIZE * .02); // 5% of the cell size
const BORDER_RADIUS = CELL_PADDING * 2;
const TILE_SIZE = CELL_SIZE - CELL_PADDING * 2;
const LETTER_SIZE = 50;


let mainSequence = [];
let currSequence = [];

class BoardView extends Component {
    constructor(props) {
        super(props);
        this.tiles = []
        this.state = {lit: 0};
    }

    shouldComponentUpdate(nextProps, nextState) {
        const tileWasPressed = this.props.lit !== nextProps.lit || this.state.lit !== nextState.lit
        const onPressDisabledChanged = this.props.disableOnPress !== nextProps.disableOnPress
        const movesArrayIncreased = this.props.numberOfMoves !== nextProps.numberOfMoves

        return tileWasPressed || onPressDisabledChanged || movesArrayIncreased
    }

    render() {
        return (
            <View style={ styles.container }>
                {this._renderTiles()}
            </View>
        )
    }

    // create four tiles
    _renderTiles() {
        let result = [];
        let i = 1;
        let bgColors = ["", "", "#3275DD", "#D93333", "#64D23B", "#FED731", "black"];
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                let position = {
                    left: col * CELL_SIZE + CELL_PADDING,
                    top: row * CELL_SIZE + CELL_PADDING
                };
                result.push(this._renderTile(i++, position, bgColors[i], 'white'));
            }
        }

        return result;
    }

    // create one tile
    _renderTile(id, position, bgColor, litBgColor) {

        //Is true when playing back the moves to the player or 
        //in a multiplayer game and the opponents plays a move
        if (this.props.lit) {
            playAudio(this.props.lit)
        }

        const isLit = this.props.lit || this.state.lit
        const backgroundColor = isLit == id ? litBgColor : bgColor

        return (
            <TouchableOpacity
                style={ [ styles.tile, position, { backgroundColor } ] }
                isAnimating={ isLit }
                activeOpacity={ this.props.disableOnPress ? 1 : .2 }
                index={ id }
                tile={ this.tiles[id] }
                key={ id }
                onPress={ () => !this.props.disableOnPress && this._onPress(id) }
                ref={ tile => this.tiles[id] = tile } />
        )
    }

    _onPress(id) {
        playAudio(id)
        InteractionManager.runAfterInteractions(() => {
            this.props.onPress(id)
        })
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
