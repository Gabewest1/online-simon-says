import React from "react"
import { Dimensions } from "react-native"
import { FormInput, FormValidationMessage } from "react-native-elements"
import styled from "styled-components/native"

const FormInputView = styled(FormInput)`
    color: white;
`
const View = styled.View`
    position: relative;
    margin-left: -20;
    margin-right: -20;
`
const FormValidationMessageView = styled(FormValidationMessage)`

`
class Input extends React.Component {
    render() {
        const { meta, placeholder, type, input: { onChange, ...restInput }} = this.props
        const shouldHideText = type === "password" && !meta.error
        console.log("PROPS:", this.props)

        return (
            <View>
                <FormInputView
                    { ...restInput }
                    shake={ meta.error }
                    placeholderTextColor="gray"
                    underlineColorAndroid="white"
                    onChangeText={ onChange }
                    secureTextEntry={ shouldHideText }
                    placeholder={ placeholder } />
                <FormValidationMessageView>{ meta.error }</FormValidationMessageView>
            </View>
        )
    }
}

export default Input
