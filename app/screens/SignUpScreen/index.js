import React from "react"
import { Keyboard } from "react-native"
import { FormInput, FormValidationMessage } from "react-native-elements"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { reduxForm, Field, SubmissionError } from "redux-form"
import styled from "styled-components/native"
import { actions as authActions } from "../../redux/Auth"

import Background from "../../components/background"

const Form = styled.View`

`
const View = styled.View`

`
const InputField = styled.TextInput`

`
const SubmitButton = styled.Button`

`

class SignUpScreen extends React.Component {
    constructor() {
        super()

        this.validate = this.validate.bind(this)
    }
    validate(values) {
        Keyboard.dismiss()

        let errors = {}

        errors.username = !values.username ? "Please enter a username" : undefined
        errors.email = !values.email ? "Please enter a email" : undefined
        errors.password = !values.password ? "Please enter a password" : undefined
        errors["re-password"] = !values["re-password"] ? "Please re-enter password" : undefined

        if (!errors.password && !errors["re-password"]) {
            errors.password = values.password.toLowerCase() !== values["re-password"].toLowerCase()
                ? "Passwords don't match"
                : undefined
        }

        if (!errors.username && !errors.email && !errors.password && !errors["re-password"]) {
            this.props.register(values)
        } else {
            throw new SubmissionError(errors)
        }
    }
    renderInput(props) {
        const { meta, placeholder, type, input: { onChange, ...restInput }} = props
        let shouldHideText = type === "password" && !meta.error
        console.log("PROPS:", props)

        return (
            <View>
                <FormInput
                    { ...restInput }
                    shake={ meta.error }
                    style={{marginBottom: -8 }}
                    placeholderTextColor="gray"
                    onChangeText={ onChange }
                    secureTextEntry={ shouldHideText }
                    placeholder={ placeholder } />
                <FormValidationMessage>{ meta.error }</FormValidationMessage>
            </View>
        )
    }
    render() {
        let { handleSubmit } = this.props

        return (
            <Background>
                <Form>
                    <Field
                        name="username"
                        type="text"
                        component={ this.renderInput }
                        placeholder="username" />
                    <Field
                        name="email"
                        type="text"
                        component={ this.renderInput }
                        placeholder="email" />
                    <Field
                        name="password"
                        type="password"
                        component={ this.renderInput }
                        placeholder="password" />
                    <Field
                        name="re-password"
                        type="password"
                        component={ this.renderInput }
                        placeholder="re-password" />
                    <SubmitButton onPress={ handleSubmit(this.validate) } title="Submit" />
                </Form>
            </Background>
        )
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(authActions, dispatch)
}

SignUpScreen.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired
}

export default reduxForm({
    form: "signUp"
})(connect(mapStateToProps, mapDispatchToProps)(SignUpScreen))

