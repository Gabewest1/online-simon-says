import styled from "styled-components/native"

export const Container = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
`
export const Item = styled.TextInput`
    border-bottom-color: ${props => props.color};
    border-bottom-width: 3;
    font-size: 30px;
    margin-left: 5px;
    top: -5px;
    color: ${props => props.color};
    color: black;
    flex-grow: 1;
`

