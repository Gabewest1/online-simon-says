import React from "react"
import { Container, Item, ListItemWithCircle } from "./styles"
import Circle from "../circle"

export const ListItemWithCircleView = ({ color, children, onPress }) => {
    return (
        <ListItemWithCircle color={ color } onPress={ onPress }>
            <Container>
                <Circle color={ "white" } radius={ 50 } />
                <Item
                    color={ color }
                    underlineColorAndroid="transparent">
                    { children }
                </Item>
            </Container>
        </ListItemWithCircle>
    )
}
