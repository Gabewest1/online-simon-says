import io from "socket.io-client"
import { Platform } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { routerReducer, routerMiddleware } from "react-router-redux"
import createSagaMiddleware from "redux-saga"
import createSocketIoMiddleware from 'redux-socket.io'
import { composeWithDevTools } from "remote-redux-devtools"
import { reducer as form } from "redux-form"
import rootSaga from "./rootSaga"
import reducers from "./rootReducer"

const socket = io('http://localhost:3000');
const socketIoMiddleware = createSocketIoMiddleware(socket, "server/")

const sagaMiddleware = createSagaMiddleware()
const reduxRouterMiddleware = routerMiddleware()
const middlewares = [socketIoMiddleware, sagaMiddleware, reduxRouterMiddleware]

let store = createStore(
    combineReducers({...reducers, router: routerReducer, form}),
    composeWithDevTools(
        applyMiddleware(...middlewares),
    )
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
