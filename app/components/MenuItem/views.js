import React from "react"
import { Container, Item } from "./styles"
import Circle from "../shared/Circle"

export const MenuItemView = ({ color, children }) => {
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
