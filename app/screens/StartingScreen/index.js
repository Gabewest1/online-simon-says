import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"

import ListItem from "../../components/list-item--circle"
import SimonSaysLogo from "../../components/simon__logo"
import Background from "../../components/background"

import { actions as userActions } from "../../redux/Auth"

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`

const List = styled.View`
    width: 80%;
    padding-bottom: 100px;
`

class StartingScreen extends React.Component {
    constructor(props) {
        super(props)

        props.giveSagasNavigator(props.navigator)
    }
    render() {
        let { navigator } = this.props

        return (
            <Container>
                <SimonSaysLogo />
                <List>
                    <ListItem onPress={ () => navigator.push({screen: "SignUpScreen", title: "SignUp", animated: true, animationType: 'slide-horizontal'}) }color={ "red" }>
                        Sign-up
                    </ListItem>
                    <ListItem onPress={ () => navigator.push({screen: "LoginScreen", title: "Login", animated: true, animationType: 'slide-horizontal'}) }color={ "blue" }>
                        Login
                    </ListItem>
                    <ListItem 
                        onPress={ () => this.props.playAsGuest() }
                        color={ "green" }>
                            Play as a guest
                    </ListItem>
                </List>
            </Container>
        )
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...userActions }, dispatch)
}

StartingScreen.propTypes = {
    giveSagasNavigator: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    playAsGuest: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(StartingScreen)
