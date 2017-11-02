if (!window.navigator.userAgent) {
    window.navigator.userAgent = "react-native"
}

const io = require("react-native-socket.io-client/socket.io")

// const PORT = "https://simon-says-online.herokuapp.com/"
const PORT = "ws://192.168.1.91:3000"
const socket = io(PORT, { jsonp: false, transports: ['websocket'] })

console.log("CONNECTING TO PORT:", PORT, socket)

export default socket
