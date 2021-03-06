import React from "react"
import { Button, Icon } from "react-native-elements"
import styled from "styled-components/native"
import PropTypes from "prop-types"

const Modal = styled.View`
    justify-content: space-between;
    backgroundColor: rgba(22, 18, 23, .8);
    borderRadius: 10;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    padding: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
`
const Buttons = styled.View`
    flex-direction: row;
    justify-content: flex-end;
`
const Header = styled.Text`
    color: white;
    font-size: 24;
    font-weight: bold;
`
const Text = styled.Text`
    color: white;
    font-size: 14;
    font-weight: 100;
`
const Heading = styled.View`
    flex-direction: row;
    justify-content: space-between;
`
class QuitModal extends React.Component {
    static navigatorStyle = {
        screenBackgroundColor: 'transparent',
        modalPresentationStyle: 'overFullScreen',
        navBarHidden: true
    }
    render() {
        const width = this.props.width || 250
        const height = this.props.height || 200

        const ButtonStyles = {
            justifyContent: "center",
            borderWidth: 2,
            height: 35,
            marginLeft: 0,
            marginRight: 0,
            paddingVertical: 0,
            paddingHorizontal: 10
        }

        return (
            <Modal
                height={ height }
                width={ width }
                style={{ transform: [{ translateX: -( width / 2) }, { translateY: -(height / 2) }] }}>
                <Heading>
                    <Header>Exit?</Header>
                    <Icon
                        color="white"
                        name="highlight-off"
                        onPress={ () => this.props.stay() } />
                </Heading>
                <Text>Are you sure you want to return to the game selection screen?</Text>
                <Buttons>
                    <Button
                        borderRadius={ 5 }
                        color="red"
                        containerViewStyle={{ ...ButtonStyles, borderColor: "red" }}
                        backgroundColor="transparent"
                        title="Exit"
                        onPress={ () => this.props.exit() } />
                    
                </Buttons>
            </Modal>
        )
    }
}

QuitModal.propTypes = {
    exit: PropTypes.func.isRequired,
    height: PropTypes.number,
    stay: PropTypes.func.isRequired,
    width: PropTypes.number
}

export default QuitModal
