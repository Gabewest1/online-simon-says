import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"
import Spinner from "react-native-spinkit"

import Background from "../../components/background"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

const Container = styled(Background)`
    justify-content: center;
    align-items: center;
`

const Text = styled.Text`
    color: white;
    margin-top: 30;
`
let IS_TRANSITIONING = false

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
            this.props.cancelSearch()
            this.props.navigator.pop()
        }

        return true
    }
    render() {
        return (
            <Container>
                { !this.props.hasFoundMatch &&
                    <Spinner isVisible={ true } size={ 100 } type="Wave" color="white" />
                }
                <Text>{this.props.hasFoundMatch ? "Found Match!" : "Looking for Match..."}</Text>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        hasFoundMatch: simonGameSelectors.hasFoundMatch(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...simonGameActions}, dispatch)
}

FindMatchScreen.propTypes = {
    cancelSearch: PropTypes.func.isRequired,
    findMatch: PropTypes.func.isRequired,
    hasFoundMatch: PropTypes.bool.isRequired,
    gameMode: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FindMatchScreen)
