import React from "react"
import { Container, Item, ListItemWithCircle, StyledIcon } from "./styles"
import Circle from "../circle"
import { BoxShadow } from 'react-native-shadow'
import styled from "styled-components/native"

const Shadow = styled(BoxShadow)`
    margin-bottom: 20px;
`
export const ListItem = ({ children, color, icon, onPress }) => {
    const dimenstions = { width: 300, height: 60 }

    const shadowOpt = {
        ...dimenstions,
        color: "#000",
        border: 2,
        radius: 5,
        opacity: .7,
        x: 0,
        y: 3,
        style:{ marginVertical: 10 }
    }

    return (
        <Shadow setting={ shadowOpt }>
            <ListItemWithCircle style={ dimenstions } onPress={ onPress }>
                <Container>
                    <StyledIcon name={ icon } />
                    <Item
                        name="people"
                        color={ color }
                        underlineColorAndroid="transparent">
                        { children }
                    </Item>
                </Container>
            </ListItemWithCircle>
        </Shadow>
    )
}
