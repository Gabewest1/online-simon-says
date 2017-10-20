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
import MenuItem from "../../components/menu-item"
import Input from "../../components/input"
import Logo from "../../components/simon__logo"

const Form = styled.View`
    width: 80%;
    flex-grow: 1;
    justify-content: center;
`
const LogoWrapper = styled.View`
    flex-grow: 2;
    align-items: center;
    justify-content: center;
`
const ButtonWrapper = styled.View`
    flex-grow: 2;
    justify-content: center;
    width: 80%;
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
            const doPasswordsMatch = values.password.toLowerCase() !== values["re-password"].toLowerCase()
                ? "Passwords don't match"
                : undefined

            errors["re-password"] = errors.password = doPasswordsMatch
        }

        if (!errors.username && !errors.email && !errors.password && !errors["re-password"]) {
            this.props.register(values)
        } else {
            throw new SubmissionError(errors)
        }
    }
    render() {
        let { handleSubmit } = this.props

        return (
            <Background around>
                <LogoWrapper>
                    <Logo />
                </LogoWrapper>
                <Form>
                    <Field
                        name="username"
                        type="text"
                        component={ Input }
                        placeholder="username" />
                    <Field
                        name="email"
                        type="text"
                        component={ Input }
                        placeholder="email" />
                    <Field
                        name="password"
                        type="password"
                        component={ Input }
                        placeholder="password" />
                    <Field
                        name="re-password"
                        type="password"
                        component={ Input }
                        placeholder="re-password" />
                </Form>
                <ButtonWrapper>
                    <MenuItem onPress={ handleSubmit(this.validate) } title="Submit" />
                </ButtonWrapper>
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

