import React from "react"
import { Navigation } from "react-native-navigation"
import store from "./store"
import { Provider } from "react-redux"

import StartingScreen from "./screens/StartingScreen"
import SignUpScreen from "./screens/SignUpScreen"
import Leaderboards from "./screens/Leaderboards"
import SelectGameMode from "./screens/SelectGameMode"
import SelectOnlineGameMode from "./screens/SelectOnlineGameMode"
import FindMatchScreen from "./screens/FindMatchScreen"
import SimonGameScreen from "./screens/SimonGameScreen"
import GameOverScreen from "./screens/GameOverScreen"
import InvitePlayersScreen from "./screens/InvitePlayersScreen"
import PlayerDisconnectedMessage from "./components/playerDisconnectedMessage"
import GameInvitationNotification from "./components/gameInvitationNotification"
import QuitModal from "./components/QuitModal"
import Notification from "./components/Notification"
import Player from "./components/player"

Navigation.registerComponent("StartingScreen", () => StartingScreen, store, Provider)
Navigation.registerComponent("SignUpScreen", () => SignUpScreen, store, Provider)
Navigation.registerComponent("Leaderboards", () => Leaderboards, store, Provider)
Navigation.registerComponent("SelectGameMode", () => SelectGameMode, store, Provider)
Navigation.registerComponent("SelectOnlineGameMode", () => SelectOnlineGameMode, store, Provider)
Navigation.registerComponent("FindMatchScreen", () => FindMatchScreen, store, Provider)
Navigation.registerComponent("SimonGameScreen", () => SimonGameScreen, store, Provider)
Navigation.registerComponent("GameOverScreen", () => GameOverScreen, store, Provider)
Navigation.registerComponent("InvitePlayersScreen", () => InvitePlayersScreen, store, Provider)
Navigation.registerComponent("PlayerDisconnectedMessage", () => PlayerDisconnectedMessage, store, Provider)
Navigation.registerComponent("GameInvitationNotification", () => GameInvitationNotification, store, Provider)
Navigation.registerComponent("QuitModal", () => QuitModal, store, Provider)
Navigation.registerComponent("Notification", () => Notification, store, Provider)
Navigation.registerComponent("Player", () => Player, store, Provider)

Navigation.startSingleScreenApp({
    screen: {
        screen: 'StartingScreen'
    },
    animated: true,
    animationType: 'slide-horizontal',
    appStyle: {
        orientation: 'portrait'
    }
})
