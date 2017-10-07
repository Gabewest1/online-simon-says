import React from "react"
import { Keyboard } from "react-native"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { reduxForm, Field, SubmissionError } from "redux-form"
import styled from "styled-components/native"

import Background from "../../components/background"

import { actions as authActions } from "../../redux/Auth"

const Form = styled.View`

`
const InputField = styled.TextInput`

`
const SubmitButton = styled.Button`

`

class LoginScreen extends React.Component {
    constructor() {
        super()

        this.validate = this.validate.bind(this)
    }
    validate(values) {
        Keyboard.dismiss()

        let errors = {}

        errors.username = !values.username ? "Please enter a username" : undefined
        errors.password = !values.password ? "Please enter a password" : undefined

        if (!errors.username && !errors.password) {
            this.props.login(values)
        } else {
            throw new SubmissionError(errors)
        }
    }
    renderInput({ meta, placeholder, type, input: { onChange, ...restInput }}) {
        let shouldHideText = type === "password" && !meta.error

        return (
            <InputField
                onChangeText={ onChange }
                secureTextEntry={ shouldHideText }
                placeholder={ meta.error ? meta.error : placeholder }
                { ...restInput } />
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
                        component={ this.renderInput.bind(this) }
                        placeholder="username or email" />
                    <Field
                        name="password"
                        type="password"
                        component={ this.renderInput.bind(this) }
                        placeholder="password" />
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

LoginScreen.propTypes = {
    login: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({
    form: "signIn"
})(connect(mapStateToProps, mapDispatchToProps)(LoginScreen))

