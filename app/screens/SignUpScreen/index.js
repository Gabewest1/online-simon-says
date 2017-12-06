import React from "react"
import { Keyboard } from "react-native"
import { FormInput, FormValidationMessage } from "react-native-elements"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { reduxForm, Field, SubmissionError } from "redux-form"
import styled from "styled-components/native"
import Spinner from "react-native-spinkit"

import { actions as authActions, selectors as userSelectors } from "../../redux/Auth"
import { actions as navigatorActions } from "../../redux/Navigator"

import { SECONDARY_COLOR } from "../../constants"

import Background from "../../components/background"
import MenuItem from "../../components/menu-item"
import Input from "../../components/input"
import Logo from "../../components/simon__logo"
import CustomNavbar from "../CustomNavbar"

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
const LoadingView = styled.View`
    width: 100%;
    align-items: center;
`
const LoadingText = styled.Text`
    font-size: 24;
`

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props)

        this.validate = this.validate.bind(this)
        this.handleBack = this.handleBack.bind(this)
        props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    handleBack({ id }) {
        if (id === "backPress") {
            this.props.navigateToScreen({
                fn: "pop",
                navigationOptions: {
                    screen: "StartingScreen",
                    backButtonHidden: true
                }
            })
        }

        return true
    }
    validate(values) {
        Keyboard.dismiss()

        values.username = values.username && values.username.trim()
        values.email = values.email && values.email.toLowerCase().trim()
        values.password = values.password && values.password.toLowerCase().trim()
        values["re-password"] = values["re-password"] && values["re-password"].toLowerCase().trim()

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
        let { isLoading, handleSubmit } = this.props

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
                        placeholder="username"
                        maxLength={ 15 } />
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
                    {
                        isLoading
                            ? <LoadingView>
                                <Spinner size={ 90 } type="Circle" color={ SECONDARY_COLOR } />
                                <LoadingText>Creating...</LoadingText>
                              </LoadingView>
                            : <MenuItem onPress={ handleSubmit(this.validate) } title="Submit" />
                     
                    }

                </ButtonWrapper>
            </Background>
        )
    }
}

function mapStateToProps(state) {
    return { isLoading: userSelectors.isLoading(state) }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...authActions, ...navigatorActions }, dispatch)
}

SignUpScreen.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired
}

export default reduxForm({
    form: "signUp"
})(CustomNavbar(connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)))

