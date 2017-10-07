import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"

import Background from "../../components/background"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`

const Text = styled.Text`

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
            this.props.cancelSearch()
            this.props.navigator.pop()
        }

        return true
    }
    transitionToGameScreenInOneSecond() {
        setTimeout(() => {
            this.props.navigator.push({
                screen: "SimonGameScreen",
                title: "",
                animated: true,
                animationType: 'slide-horizontal',
                passProps: { gameMode: this.props.gameMode },
                overrideBackPress: true,
                backButtonHidden: true
            })
        }, 1000)
    }
    render() {
        if (this.props.hasFoundMatch) {
            this.transitionToGameScreenInOneSecond()
        }

        return (
            <Container>
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
