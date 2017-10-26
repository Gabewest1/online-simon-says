import React from "react"
import Icon from "react-native-vector-icons/MaterialIcons"

export default class HomeIcon extends React.Component {
    render() {
        const props = this.props
        console.log("MY PROPS:", props)
        return (
            <Icon name="home" size={ 32 } { ...props } onPress={ props.onClick }/>
        )
    }
}
