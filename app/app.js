import React from "react"
import { Navigation } from "react-native-navigation"
import store from "./store"
import { Provider } from "react-redux"

import StartingScreen from "./screens/StartingScreen"
import SignUpScreen from "./screens/SignUpScreen"
import LoginScreen from "./screens/LoginScreen"
import Leaderboards from "./screens/Leaderboards"
import SelectGameMode from "./screens/SelectGameMode"
import SelectOnlineGameMode from "./screens/SelectOnlineGameMode"
import FindMatchScreen from "./screens/FindMatchScreen"
import SimonGameScreen from "./screens/SimonGameScreen"
import SinglePlayerGameOverScreen from "./screens/SinglePlayerGameOverScreen"
import InvitePlayersScreen from "./screens/InvitePlayersScreen"
import PlayerDisconnectedMessage from "./components/playerDisconnectedMessage"
import GameInvitationNotification from "./components/gameInvitationNotification"

console.log("STARTING UP MY APP")

Navigation.registerComponent("StartingScreen", () => StartingScreen, store, Provider)
Navigation.registerComponent("SignUpScreen", () => SignUpScreen, store, Provider)
Navigation.registerComponent("LoginScreen", () => LoginScreen, store, Provider)
Navigation.registerComponent("Leaderboards", () => Leaderboards, store, Provider)
Navigation.registerComponent("SelectGameMode", () => SelectGameMode, store, Provider)
Navigation.registerComponent("SelectOnlineGameMode", () => SelectOnlineGameMode, store, Provider)
Navigation.registerComponent("FindMatchScreen", () => FindMatchScreen, store, Provider)
Navigation.registerComponent("SimonGameScreen", () => SimonGameScreen, store, Provider)
Navigation.registerComponent("SinglePlayerGameOverScreen", () => SinglePlayerGameOverScreen, store, Provider)
Navigation.registerComponent("InvitePlayersScreen", () => InvitePlayersScreen, store, Provider)
Navigation.registerComponent("PlayerDisconnectedMessage", () => PlayerDisconnectedMessage, store, Provider)
Navigation.registerComponent("GameInvitationNotification", () => GameInvitationNotification, store, Provider)

Navigation.startSingleScreenApp({
    screen: {
        label: 'Home',
        screen: 'StartingScreen',
        title: 'Home',
        icon: require("./assets/images/home.png")
    },
    animated: true,
    animationType: 'slide-horizontal'
})
// Navigation.startTabBasedApp({
//     tabs: [
//         {
//             label: 'Home',
//             screen: 'StartingScreen',
//             title: 'Home',
//             icon: require("./assets/images/home.png")
//         },
//         {
//             label: 'Sign-up',
//             screen: 'SignUpScreen',
//             title: 'Sign-up',
//             icon: require("./assets/images/home.png")
//         },
//         {
//             label: 'Login',
//             screen: 'LoginScreen',
//             title: 'Login',
//             icon: require("./assets/images/home.png")
//         }
//     ]
// })
