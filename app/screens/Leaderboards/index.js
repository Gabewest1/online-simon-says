import React from "react"
import { Dimensions } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import { List } from "react-native-elements"
import PropTypes from "prop-types"
import Spinner from "react-native-spinkit"

import { BACKGROUND_COLOR } from "../../constants"
import Background from "../../components/background"
import Player from "../../components/player"

import { actions as leaderboardActions, selectors as leaderboardSelectors } from "../../redux/Leaderboards"

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const PlayerStatsWrapper = styled.View`
    alignItems: center;
    borderLeftWidth: 3;
    borderColor: ${ BACKGROUND_COLOR };
    flexDirection: row;
    justifyContent: space-between;
    padding-right: 15;
    flex-grow: 1;
`
const Stats = styled.Text``

const RankWrapper = styled.View`
    align-items: center;
    flex-direction: row;
    justify-content: center;
    width: 30;
`
const Rank = styled.Text`
    color: black;
`

class Leaderboards extends React.Component {
    componentWillMount() {
        this.props.fetchLeaderboardData()
    }
    render() {
        console.log("PLAYERSL:", this.props.players)

        return (
            <Background centered={ this.props.isLoading }>
                { this.props.isLoading
                    ? <Spinner isVisible={ true } size={ 100 } type="FadingCircleAlt" color="white" />
                    : this.renderLeaderboard()
                }
            </Background>
        )
    }
    renderLeaderboard() {
        return (
            <List style={{ backgroundColor: "white", width: Dimensions.get("window").width }}>
                {
                    this.props.players.map((player, index) => (
                        <Container key={ player.username }>
                            <RankWrapper>
                                <Rank>{ index + 1}</Rank>
                            </RankWrapper>
                            <PlayerStatsWrapper>
                                <Player player={ player } />
                                <Stats>Highscore: { player.statsByGameMode[1].bestStreak }</Stats>
                            </PlayerStatsWrapper>
                        </Container>
                    ))
                }
            </List>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: leaderboardSelectors.isLoading(state),
        players: leaderboardSelectors.getPlayers(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...leaderboardActions }, dispatch)
}

Leaderboards.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    fetchLeaderboardData: PropTypes.func.isRequired,
    players: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboards)
