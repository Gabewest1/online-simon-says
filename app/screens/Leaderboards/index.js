import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from  "styled-components/native"
import PropTypes from "prop-types"

import Background from "../../components/background"

const Container = styled(Background)`
    justify-content: space-around;
    align-items: center;
`
const Text = styled.Text`

`

class Leaderboards extends React.Component {
    render() {
        return (
            <Container>
                <Text>Leaderboards</Text>
            </Container>
        )
    }
}

function mapStateToProps() {
    return {}
}

function mapDispatchToProps() {
    return {}
}

Leaderboards.propTypes = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboards)
