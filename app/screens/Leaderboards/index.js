import React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { View } from "react-native"
import styled from "styled-components/native"
import { List, ListItem } from "react-native-elements"
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

const Stats = styled.Text`
`
const RankWrapper = styled.View`
    justify-content: center;
    align-items: center;
    width: 30;
    position: absolute;
    top: 0;
    bottom: 0;
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
            <List>
                {
                    this.props.players.map((player, index) => (
                        <ListItem
                            key={ player.username }
                            containerStyle={{ paddingTop: 0, paddingBottom: 0 }}
                            hideChevron={ true }
                            title={
                                <Container>
                                    <RankWrapper>
                                        <Rank>{ index + 1}</Rank>
                                    </RankWrapper>
                                    <View style={{ borderLeftWidth: 3, borderColor: BACKGROUND_COLOR, marginLeft: 30, flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}>
                                        <Player player={ player } />
                                        <Stats>Highscore: { player.statsByGameMode[1].bestStreak }</Stats>
                                    </View>
                                </Container>
                            } />
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
