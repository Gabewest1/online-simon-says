import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import PropTypes from "prop-types"

import {
    actions as simonGameActions,
    selectors as simonGameSelectors
} from "../../redux/SimonSaysGame"

const Container = styled.View`
    height: 100%;
    justify-content: space-around;
    align-items: center;
`

const Text = styled.Text`

`

class FindMatchScreen extends React.Component {
    render() {
        const { hasFoundMatch } = this.props

        return (
            <Container>
                <Text>{hasFoundMatch ? "Found Match!" : "Looking for Match..."}</Text>
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
    findMatch: PropTypes.func.isRequired,
    hasFoundMatch: PropTypes.bool.isRequired,
    gameMode: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FindMatchScreen)
