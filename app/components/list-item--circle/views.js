import React from "react"
import { Container, Item } from "./styles"
import Circle from "../circle"

export const ListItemWithCircleView = ({ color, children }) => {
    return (
        <Container>
            <Circle color={ color } radius={ 50 } />
            <Item
                color={ color }
                placeholder={ children }
                underlineColorAndroid="transparent" />
        </Container>
    )
}
