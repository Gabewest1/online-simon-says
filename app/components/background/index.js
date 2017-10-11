import React from "react"
import styled from "styled-components/native"
import { BACKGROUND_COLOR } from "../../constants"

const Container = styled.View`
    background-color: ${BACKGROUND_COLOR};
    width: 100%;
    height: 100%;
    ${({ centered }) => centered && "align-items: center; justify-content: center;"}
`

export default Container
