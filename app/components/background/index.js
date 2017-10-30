import React from "react"
import styled from "styled-components/native"
import { BACKGROUND_COLOR } from "../../constants"

const Container = styled.View`
    background-color: ${BACKGROUND_COLOR};
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-start;
    ${({ centered }) => centered && "justify-content: center;"}
    ${({ around }) => around && "justify-content: space-around;"}
    ${({ between }) => between && "justify-content: space-between;"}
`

export default Container
