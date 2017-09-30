import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import createSagaMiddleware from "redux-saga"
import createSocketIoMiddleware from 'redux-socket.io'
import { reducer as form } from "redux-form"
import rootSaga from "./rootSaga"
import reducers from "./rootReducer"

if (!window.navigator.userAgent) {
    window.navigator.userAgent = "react-native"
}
const io = require("react-native-socket.io-client/socket.io")

const PORT = "https://simon-says-online.herokuapp.com/"
const socket = io(PORT, { jsonp: false, transports: ['websocket'] })
console.log("CONNECTING TO PORT:", PORT, socket)
const socketIoMiddleware = createSocketIoMiddleware(socket, "server/")

const sagaMiddleware = createSagaMiddleware()
const middlewares = [socketIoMiddleware, sagaMiddleware]

let store = createStore(
    combineReducers({...reducers, form}),
    applyMiddleware(...middlewares)
)

//create store
if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = combineReducers(require('./rootReducer').default)
      store.replaceReducer(nextRootReducer)
    })
}

sagaMiddleware.run(rootSaga)

export default store
