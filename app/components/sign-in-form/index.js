import React from "react"
import { FormInput, FormValidationMessage } from "react-native-elements"
import { Keyboard, View, Text } from "react-native"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { reduxForm, Field, SubmissionError } from "redux-form"
import styled from "styled-components/native"

import ListItem from "../menu-item"
import Input from "../input"


import { actions as authActions } from "../../redux/Auth"

const Form = styled.View`
    justify-content: center;
    width: 280;
`
const PlayAsGuest = styled.Text`
    color: white;
    border-bottom-width: 2;
    border-color: white;
    align-self: flex-end;
    margin-top: 5;
`

class SignInForm extends React.Component {
    constructor() {
        super()

        this.validate = this.validate.bind(this)
        this.gotoSignUpScreen = this.gotoSignUpScreen.bind(this)
    }
    gotoSignUpScreen() {
        this.props.navigator.push({
            screen: "SignUpScreen",
            title: "Sign Up",
            animated: true,
            animationType: "slide-horizontal",
        })
    }
    validate(values) {
        Keyboard.dismiss()

        values.username = values.username && values.username.toLowerCase().trim()
        values.password = values.password && values.password.toLowerCase().trim()

        let errors = {}

        errors.username = !values.username ? "Please enter a username" : undefined
        errors.password = !values.password ? "Please enter a password" : undefined

        if (!errors.username && !errors.password) {
            this.props.login(values)
        } else {
            throw new SubmissionError(errors)
        }
    }
    render() {
        let { handleSubmit } = this.props

        return (
            <Form>
                <Field
                    name="username"
                    type="text"
                    component={ Input }
                    placeholder="username or email" />
                <Field
                    name="password"
                    type="password"
                    component={ Input }
                    placeholder="password" />
                <ListItem
                    style={{ marginTop: 25 }}
                    onPress={ handleSubmit(this.validate) }
                    icon={{name: "airplay" }}>
                        Login
                </ListItem>
                <ListItem
                    style={{ marginVertical: 25 }}
                    onPress={ this.gotoSignUpScreen }
                    icon={{name: "border-color"}}>
                            Sign Up
                </ListItem>

                <PlayAsGuest onPress={ () => this.props.playAsGuest() }>Play as Guest</PlayAsGuest>
            </Form>
        )
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(authActions, dispatch)
}

SignInForm.propTypes = {
    login: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired
}

export default reduxForm({
    form: "signIn"
})(connect(mapStateToProps, mapDispatchToProps)(SignInForm))

