import React from "react"
import { ListItemWithCircleView } from "./views"

class ListItemWithCircle extends React.Component {
    render() {
        return (
            <ListItemWithCircleView { ...this.props } />
        )
    }
}

export default ListItemWithCircle
