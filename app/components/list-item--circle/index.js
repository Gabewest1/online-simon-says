import React from "react"
import { ListItem } from "./views"

class ListItemWithCircle extends React.Component {
    render() {
        return (
            <ListItem { ...this.props } />
        )
    }
}

export default ListItemWithCircle
