import React from "react"
import { Icon } from "react-native-elements"
import styled from "styled-components/native"

const PlayerView = styled.View`
    position: relative;
    flex-direction: row;
    align-items: center;
`
const IconView = styled.View`
    position: relative;
    align-items: center;
    justify-content: center;
`
const Level = styled.Text`
    position: absolute;
    color: white;
    background-color: transparent;
`
const Name = styled.Text`
    margin-horizontal: 4;
`
const Image = styled.Image`
    
`

class Player extends React.Component {
    render() {
        const { level, username } = this.props.player

        return (
            <PlayerView { ...this.props }>
                <IconView>
                    <Image { ...this.props.icon } source={ require("../../assets/images/level.png") } />
                    <Level { ...this.props.level }>{ level }</Level>
                </IconView>
                <Name { ...this.props } { ...this.props.name }>{ username }</Name>
            </PlayerView>
        )
    }
}

export default Player
