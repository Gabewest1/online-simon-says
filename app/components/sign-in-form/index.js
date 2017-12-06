import React from "react"
import { FormInput, FormValidationMessage } from "react-native-elements"
import { AsyncStorage, Keyboard } from "react-native"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { reduxForm, Field, SubmissionError } from "redux-form"
import styled from "styled-components/native"
import Spinner from "react-native-spinkit"

import ListItem from "../menu-item"
import Input from "../input"

import { actions as authActions } from "../../redux/Auth"
import { actions as navigatorActions } from "../../redux/Navigator"
import { SECONDARY_COLOR } from "../../constants"

const Form = styled.View`
    width: 80%;
    max-width: 600px;
`
const Buttons = styled.View`
    justify-content: space-around;
`
const LoadingNotification = styled.View`
    justify-content: center;
    align-items: center;
`
const LoadingText = styled.Text`
    font-size: 24px;
`

class SignInForm extends React.Component {
    constructor() {
        super()

        this.validate = this.validate.bind(this)
        this.gotoSignUpScreen = this.gotoSignUpScreen.bind(this)
    }
    async setRememberedUser() {
        try {
            console.log("RETRIEVING REMEMBERED USER")
            const username = await AsyncStorage.getItem("username")
            const password = await AsyncStorage.getItem("password")

            if (username && password) {
                console.log("Setting users data", username, password)
                this.props.initialize({ username, password })
            }
        } catch (e) {
            console.log(e)
        }
    }
    componentWillMount() {
        console.log(this.setRememberedUser)
        this.setRememberedUser()
    }
    gotoSignUpScreen() {
        this.props.navigateToScreen({
            fn: "push",
            navigationOptions: {
                screen: "SignUpScreen",
                title: "Sign Up",
                animated: true,
                animationType: "slide-horizontal",
                overrideBackPress: true
            }
        })
    }
    validate(values) {
        Keyboard.dismiss()

        values.username = values.username && values.username.trim()
        values.password = values.password && values.password.trim()

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
        let { isLoading, handleSubmit, style } = this.props
        console.log("STYLE:", style, typeof style)

        return (
            <Form style={ style }>
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
                {
                    isLoading ? <LoadingNotification>
                        <Spinner type="Circle" color={ SECONDARY_COLOR } size={ 90 } />
                        <LoadingText>Loggin In</LoadingText>
                    </LoadingNotification>
                        : (
                            <Buttons>
                                <ListItem
                                    style={{ marginVertical: 15 }}
                                    onPress={ handleSubmit(this.validate) }
                                    icon={{name: "airplay" }}>
                                        Login
                                </ListItem>
                                <ListItem
                                    disabled={ false }
                                    style={{ marginBottom: 15 }}
                                    onPress={ () => this.props.playAsGuest() }
                                    icon={{name: "person-outline"}}>
                                            Play as Guest
                                </ListItem>
                                <ListItem
                                    onPress={ this.gotoSignUpScreen }
                                    icon={{name: "border-color"}}>
                                            Sign Up
                                </ListItem>
                            </Buttons>

                        )
                }

            </Form>
        )
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...authActions, ...navigatorActions }, dispatch)
}

SignInForm.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    navigateToScreen: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number, PropTypes.string])
}

export default reduxForm({
    form: "signIn"
})(connect(mapStateToProps, mapDispatchToProps)(SignInForm))

