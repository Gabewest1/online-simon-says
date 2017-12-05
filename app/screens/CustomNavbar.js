import React from "react"
import { Platform } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"

export default function CustomNavbar(Component) {
    return class CustomComponent extends React.Component {
        componentDidMount() {
            if (Platform.OS === "ios") {
                this.setNavbarForIOS()
            }
        }
        setNavbarForIOS() {
            Icon.getImageSource("chevron-left", 27).then(icon => {
                this.props.navigator.setButtons({
                    leftButtons: [
                        { id: "backPress", icon, title: "Back" }
                    ]
                })
            })
        }
        render() {
            return <Component { ...this.props } />
        }
    }
}