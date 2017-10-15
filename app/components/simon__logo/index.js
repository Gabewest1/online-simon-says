import React from "react"
import styled from "styled-components/native"
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Tspan,
    Use,
    Defs,
    Stop
} from 'react-native-svg'

const Container = styled.View`
    flex-direction: row;
`
const SimonLogo = styled.Image`

`

class SimonSaysLogo extends React.Component {
        // <Filter x="-3.0%" y="-5.0%" width="106.0%" height="114.0%" filterUnits="objectBoundingBox" id="filter-2">
        //     <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
        //     <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
        //     <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        // </Filter>
        render() {
            return (
                <Svg width="280" height="130" viewBox="0 0 280 130" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <G id="Simon-Components" stroke="none" strokWidth="1" fill="none" fillRule="evenodd">
                        <Text id="text-1" fontFamily="DINAlternate-Bold, DIN Alternate" fontSize="90" fontWeight="bold" fill="#FFFFFF">
                            Simon
                        </Text>
                        <G id="simon-logo">
                            <Circle id="red" fill="#CA2A2A" cx="19.5" cy="19.5" r="19.5"></Circle>
                            <Ellipse id="blue" fill="#2E50DA" cx="260" cy="95" rx="14.5" ry="16.0675676"></Ellipse>
                            
                            <Circle id="green" fill="#57AD42" cx="74" cy="95" r="14"></Circle>
                            <Circle id="yellow" fill="#CEE137" cx="170" cy="30" r="18.5"></Circle>
                        </G>
                    </G>
                </Svg>
        )
    }
}

export default SimonSaysLogo
