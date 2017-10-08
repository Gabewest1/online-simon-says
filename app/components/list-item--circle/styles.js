import styled from "styled-components/native"
import { BACKGROUND_COLOR } from "../../constants"

// background-color: ${props => props.color};
export const ListItemWithCircle = styled.TouchableOpacity`
    background-color: ${BACKGROUND_COLOR};
    border: white;
    border-radius: 5px;
    border-width: 1px;
    position: relative;
    shadow-opacity: 0.75;
    shadow-radius: 5px;
    shadow-color: red;
    shadow-offset: 0px 0px;
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
