import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import Spinner from "react-native-spinkit"
import { SECONDARY_COLOR } from "../../constants"

import Background from "../../components/background"
import CustomNavbar from "../CustomNavbar"

import { actions as navigatorActions } from "../../redux/Navigator"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

const Container = styled(Background)`
    justify-content: center;
    align-items: center;
`

const Text = styled.Text`
    color: ${ SECONDARY_COLOR };
    margin-top: 30;
`

class FindMatchScreen extends React.Component {
    constructor(props) {
        super(props)

        this.handleBack = this.handleBack.bind(this)
        this.props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    componentDidMount() {
        this.props.findMatch(this.props.gameMode)
    }
    handleBack({ id }) {
        if (id === "backPress") {
            if (!this.props.hasFoundMatch) {
                this.props.cancelSearch()
                this.props.navigateToScreen({
                    fn: "resetTo",
                    navigationOptions: {
                        screen: "SelectGameMode",
                        backButtonHidden: true
                    }
                })
            }
        }

        return true
    }
    render() {
        return (
            <Container>
                { !this.props.hasFoundMatch &&
                    <Spinner isVisible={ true } size={ 120 } type="Wave" color={ SECONDARY_COLOR } />
                }
                <Text>{this.props.hasFoundMatch ? "Found Match!" : "Looking for Match..."}</Text>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameMode: simonGameSelectors.getGameMode(state),
        hasFoundMatch: simonGameSelectors.hasFoundMatch(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...simonGameActions, ...navigatorActions }, dispatch)
}

FindMatchScreen.propTypes = {
    cancelSearch: PropTypes.func.isRequired,
    gameMode: PropTypes.number.isRequired,
    findMatch: PropTypes.func.isRequired,
    gameMode: PropTypes.number.isRequired,
    hasFoundMatch: PropTypes.bool.isRequired,
    navigator: PropTypes.object.isRequired,
    navigateToScreen: PropTypes.func.isRequired
}

export default CustomNavbar(connect(mapStateToProps, mapDispatchToProps)(FindMatchScreen))
