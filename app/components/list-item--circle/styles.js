import styled from "styled-components/native"

export const ListItemWithCircle = styled.TouchableHighlight`
    background-color: ${props => props.color};
    margin-bottom: 20px;
    width: 100%;
    padding-left: 5px;
`
export const Item = styled.Text`
    font-size: 30px;
    color: white;
    margin-left: 10px;
    text-align: center;
    flex-grow: 1;
`
export const Container = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 5px;
`
