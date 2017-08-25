/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import styled from "styled-components/native"

let Navbar = styled.View`
  height: 65px;
  background: lightblue;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  top: 0;
  width: 100%;
  font-size: 22px;
`

let NavItem = styled.Text`
  color: #efefef;
`

export default class Online extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Navbar>
          <NavItem>
              Home
          </NavItem>
          <NavItem>
              About
          </NavItem>
          <NavItem>
              Projects
          </NavItem>
          <NavItem>
              Contact
          </NavItem>
        </Navbar>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text>
          Home of the Dimesdale Dimmadome!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
      </View>
    );
  }
}

console.log("STYLES", styles)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Online', () => Online);
