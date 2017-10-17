import React from "react"
import { FormInput, FormValidationMessage } from "react-native-elements"
import { Keyboard, View, Text } from "react-native"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { reduxForm, Field, SubmissionError } from "redux-form"
import styled from "styled-components/native"

import ListItem from "../../components/menu-item"


import { actions as authActions } from "../../redux/Auth"

const Form = styled.View`
    padding-left: 10;
    padding-right: 10;
    justify-content: center;
`
const SignUpText = styled.Text`
    color: white;
    border-bottom-width: 2;
    border-color: white;
    align-self: flex-start;
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

        let errors = {}

        errors.username = !values.username ? "Please enter a username" : undefined
        errors.password = !values.password ? "Please enter a password" : undefined

        if (!errors.username && !errors.password) {
            this.props.login(values)
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
                    containerStyle={{ marginLeft: 0, marginRight: 0 }}
                    inputStyle={{ marginLeft: 0, marginRight: 0 }}
                    shake={ meta.error }
                    placeholderTextColor="gray"
                    onChangeText={ onChange }
                    secureTextEntry={ shouldHideText }
                    placeholder={ placeholder } />
                <FormValidationMessage labelStyle={{ marginLeft: 0, marginRight: 0 }}>{ meta.error }</FormValidationMessage>
            </View>
        )
    }
    render() {
        let { handleSubmit } = this.props

        return (
            <Form>
                <Field
                    name="username"
                    type="text"
                    component={ this.renderInput }
                    placeholder="username or email" />
                <Field
                    name="password"
                    type="password"
                    component={ this.renderInput }
                    placeholder="password" />
                <SignUpText onPress={ this.gotoSignUpScreen }>SignUp</SignUpText>
                <ListItem
                    style={{ marginTop: 25 }}
                    onPress={ handleSubmit(this.validate) }
                    icon={{name: "airplay" }}>
                        Login
                </ListItem>
                <ListItem
                    style={{ marginTop: 15 }}
                    onPress={ () => this.props.playAsGuest() }
                    icon={{name: "person-outline"}}>
                            Play as a guest
                </ListItem>
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
    navigator: PropTypes.func.isRequired,
    playAsGuest: PropTypes.func.isRequired
}

export default reduxForm({
    form: "signIn"
})(connect(mapStateToProps, mapDispatchToProps)(SignInForm))

