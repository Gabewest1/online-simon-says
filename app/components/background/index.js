import React from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"
import { BACKGROUND_COLOR } from "../../constants"

const { height, width } = Dimensions.get("window")

const Container = styled.View`
    background-color: ${({ color }) => color || BACKGROUND_COLOR};
    width: ${ width };
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    ${({ centered }) => centered && "justify-content: center;"}
    ${({ around }) => around && "justify-content: space-around;"}
    ${({ between }) => between && "justify-content: space-between;"}
`

export default Container
