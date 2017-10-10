import styled from "styled-components/native"
import Icon from 'react-native-vector-icons/MaterialIcons'
import { BACKGROUND_COLOR } from "../../constants"

const FONT_SIZE = 30

export const ListItemWithCircle = styled.TouchableOpacity`
    background-color: ${BACKGROUND_COLOR};
    border: white;
    border-radius: 5px;
    border-width: 1px;
    position: relative;
`
export const Item = styled.Text`
    font-size: ${FONT_SIZE};
    color: white;
    margin-left: 10px;
    text-align: center;
    flex-grow: 1;
    height: 100%;
`
export const Container = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 5px;
    height: 100%;
`
export const StyledIcon = styled(Icon)`
    color: white;
    font-size: ${FONT_SIZE};
`