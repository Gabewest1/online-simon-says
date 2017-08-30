import React from "react"
import { MenuItemView } from "./views"

class MenuItem extends React.Component {
    render() {
        return (
            <MenuItemView { ...this.props } />
        )
    }
}

export default MenuItem
