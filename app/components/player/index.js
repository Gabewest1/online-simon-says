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
`
const Name = styled.Text``

class Player extends React.Component {
    render() {
        const { level, username } = this.props.player

        return (
            <PlayerView { ...this.props }>
                <IconView>
                    <Icon size={ 50 } name="star" />
                    <Level>{ level }</Level>
                </IconView>
                <Name>{ username }</Name>
            </PlayerView>
        )
    }
}

export default Player
