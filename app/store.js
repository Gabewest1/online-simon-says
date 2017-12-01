import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import createSagaMiddleware from "redux-saga"
import createSocketIoMiddleware from 'redux-socket.io'
import logger from 'redux-logger'
import { reducer as form } from "redux-form"
import rootSaga from "./rootSaga"
import reducers from "./rootReducer"
import socket from "./socket"

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
