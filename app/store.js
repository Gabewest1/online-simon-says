import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { routerReducer, routerMiddleware } from "react-router-redux"
import createSagaMiddleware from "redux-saga"
import createSocketIoMiddleware from 'redux-socket.io'
import { reducer as form } from "redux-form"
import rootSaga from "./rootSaga"
import reducers from "./rootReducer"

import io from "react-native-socket.io-client/socket.io"

const PORT = "192.168.1.91:3000"
const socket = io(PORT, { jsonp: false, transports: ['websocket'] })
console.log("CONNECTING TO PORT:", PORT, socket)
const socketIoMiddleware = createSocketIoMiddleware(socket, "server/")

const sagaMiddleware = createSagaMiddleware()
const reduxRouterMiddleware = routerMiddleware()
const middlewares = [socketIoMiddleware, sagaMiddleware, reduxRouterMiddleware]

let store = createStore(
    combineReducers({...reducers, router: routerReducer, form}),
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
