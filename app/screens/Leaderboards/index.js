import React from "react"
import { Dimensions, StyleSheet, FlatList } from "react-native"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import styled from "styled-components/native"
import { List } from "react-native-elements"
import PropTypes from "prop-types"
import Spinner from "react-native-spinkit"

import { BACKGROUND_COLOR, SECONDARY_COLOR } from "../../constants"
import Background from "../../components/background"
import Player from "../../components/player"

import { actions as leaderboardActions, selectors as leaderboardSelectors } from "../../redux/Leaderboards"
import { actions as navigatorActions } from "../../redux/Navigator"
import { selectors as userSelectors } from "../../redux/Auth"

const { width } = Dimensions.get("window")

const FONT_SIZE = width > 768 ? 24 : 14

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    borderWidth: 1;
    borderColor: ${ BACKGROUND_COLOR };
`
const PlayerStatsWrapper = styled.View`
    alignItems: center;
    borderLeftWidth: 3;
    borderColor: ${({ borderColor }) => borderColor ? borderColor : BACKGROUND_COLOR }};
    flexDirection: row;
    justifyContent: space-between;
    padding-right: 15;
    padding-left: 5;
    flex-grow: 1;
`
const Stats = styled.Text`
    color: ${ BACKGROUND_COLOR };
    fontSize: ${ FONT_SIZE }
`

const RankWrapper = styled.View`
    align-items: center;
    flex-direction: row;
    justify-content: center;
    width: 40;
`
const Rank = styled.Text`
    color: ${ BACKGROUND_COLOR };
    fontSize: ${ FONT_SIZE }
`
const Sticky = styled.View`
    position: absolute;
    top: 0;
    width: 100%;
`
const styles = StyleSheet.create({
    icon: {
        marginVertical: FONT_SIZE * .8,
        borderColor: BACKGROUND_COLOR,
        borderWidth: 1,
        borderRadius: 50
    },
    list: {
        backgroundColor: SECONDARY_COLOR,
        width: Dimensions.get("window").width
    },
    name: {
        color: BACKGROUND_COLOR,
        fontSize: FONT_SIZE,
        marginLeft: FONT_SIZE * .6
    }
})

class Leaderboards extends React.Component {
    constructor(props) {
        super(props)

        this.handleBack = this.handleBack.bind(this)
        this.props.navigator.setOnNavigatorEvent(this.handleBack)
    }
    componentWillMount() {
        this.props.fetchLeaderboardData()
    }
    handleBack({ id }) {
        if (id === "backPress") {
            this.props.navigateToScreen({
                fn: "pop",
                navigationOptions: {
                    screen: "SelectGameMode",
                    backButtonHidden: true
                }
            })
        }

        return true
    }
    render() {
        const { isLoading, myPlayer } = this.props
        const myPlayerStyles = { color: SECONDARY_COLOR }

        return (
            <Background centered={ this.props.isLoading }>
                { !isLoading && this.renderPlayer({ item: myPlayer, index: 11, style: myPlayerStyles }) }
                { isLoading
                    ? <Spinner isVisible={ true } size={ 100 } type="FadingCircleAlt" color={ SECONDARY_COLOR } />
                    : this.renderLeaderboard()
                }
            </Background>
        )
    }
    renderLeaderboard() {
        return (
            <List style={ styles.list }>
                <FlatList
                    data={ this.props.players }
                    renderItem={ this.renderPlayer } />

            </List>
        )
    }
    renderPlayer({ item, index, style }) {
        console.log("PLAYER:", item)

        return (
            <Container key={ item.username }>
                <RankWrapper>
                    <Rank style={ style }>{ index + 1}</Rank>
                </RankWrapper>
                <PlayerStatsWrapper borderColor={ style && style.color }>
                    <Player
                        player={ item }
                        icon={{ style: [styles.icon, style] }}
                        name={{ style: [styles.name, style] }} />
                    <Stats style={ style }>Highscore: { item.statsByGameMode[1].highScore }</Stats>
                </PlayerStatsWrapper>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLoading: leaderboardSelectors.isLoading(state),
        myHighscore: userSelectors.getHighScore(state),
        myPlayer: userSelectors.getUser(state),
        players: leaderboardSelectors.getPlayers(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ ...leaderboardActions, ...navigatorActions }, dispatch)
}

Leaderboards.propTypes = {
    myHighscore: PropTypes.number.isRequired,
    myPlayer: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    fetchLeaderboardData: PropTypes.func.isRequired,
    navigateToScreen: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboards)
