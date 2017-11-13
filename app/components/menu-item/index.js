import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { Dimensions } from "react-native"
import { Button } from "react-native-elements"
import { BACKGROUND_COLOR, SECONDARY_COLOR } from "../../constants"

import { selectors as navigatorSelectors } from "../../redux/Navigator"

class MenuItem extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            debouncing: false,
            debounceTime: 2000
        }
    }
    debounceDecorator = fn => () => {
        if (!this.state.debouncing) {
            fn()
            this.setState({ debouncing: true })
            setTimeout(
                () => this.setState({ debouncing: false }),
                this.state.debounceTime
            )
        }
    }
    render() {
        const { children, icon, inverted, fontSize, onPress, style, title } = this.props

        const borderStyles = {
            borderColor: inverted ? BACKGROUND_COLOR : SECONDARY_COLOR,
            borderRadius: 30,
            borderWidth: 1
        }

        const width = Dimensions.get("window").width

        const FONT_SIZE = fontSize
            || width > 500 ? 26
            : 18

        const color = inverted ? BACKGROUND_COLOR : SECONDARY_COLOR
        const didPlayerPassInDisabledProp = this.props.disabled !== undefined
        const disabled = didPlayerPassInDisabledProp 
            ? this.props.disabled
            : !this.props.doesPlayerHaveInternet

        return (
            <Button
                raised
                disabled={ disabled }
                fontSize={ FONT_SIZE }
                color={ disabled ? "#c4bcbc" : color }
                backgroundColor={ inverted ? SECONDARY_COLOR : BACKGROUND_COLOR }
                icon={{ ...icon, style: { position: "absolute", left: "10%", color, fontSize: FONT_SIZE } }}
                buttonStyle={{
                    ...borderStyles,
                    marginLeft: 0,
                    marginRight: 0
                }}
                disabledStyle={{ backgroundColor: "#828282" }}
                containerViewStyle={{ ...style, ...borderStyles, marginLeft: 0, marginRight: 0 }}
                title={ children || title }
                onPress={ this.debounceDecorator(onPress) } />
        )
    }
}


function mapStateToProps(state) {
    return {
        doesPlayerHaveInternet: navigatorSelectors.doesPlayerHaveInternet(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItem)
