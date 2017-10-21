import React from "react"
import { Dimensions } from "react-native"
import { FormInput, FormValidationMessage } from "react-native-elements"
import styled from "styled-components/native"
import { SearchBar } from "react-native-elements"

const FormInputView = styled(FormInput)`
    color: white;
`
const View = styled.View`
    position: relative;
    margin-left: -20;
    margin-right: -20;
`
const SearchBarContainer = styled.View`

`
const FormValidationMessageView = styled(FormValidationMessage)`

`
class Input extends React.Component {
    render() {
        const { searchBar } = this.props

        return searchBar ? this.renderSearchBar() : this.renderInputBar()
    }
    renderInputBar() {
        const { meta, placeholder, type, input: { onChange, ...restInput }} = this.props
        const shouldHideText = type === "password" && !meta.error

        return (
            <View>
                <FormInputView
                    { ...restInput }
                    containerStyle={ this.props.containerStyle }
                    inputStyle={ this.props.inputStyle }
                    icon={ this.props.icon }
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
    renderSearchBar() {
        const { meta, placeholder, type, input: { onChange, ...restInput }} = this.props
        const shouldHideText = type === "password" && !meta.error

        return (
            <SearchBarContainer>
                <SearchBar
                    { ...restInput }
                    containerStyle={ this.props.containerStyle }
                    inputStyle={ this.props.inputStyle }
                    icon={ this.props.icon }
                    shake={ meta.error }
                    placeholderTextColor="gray"
                    underlineColorAndroid="white"
                    onChangeText={ onChange }
                    secureTextEntry={ shouldHideText }
                    placeholder={ placeholder } />
                <FormValidationMessageView>{ meta.error }</FormValidationMessageView>
            </SearchBarContainer>
        )
    }
}

export default Input
