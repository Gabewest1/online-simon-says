import { createStore, combineReducers, applyMiddleware } from "redux"
import { routerReducer, routerMiddleware } from "react-router-redux"
import createSagaMiddleware from "redux-saga"
import { composeWithDevTools } from "redux-devtools-extension"
import rootSaga from "./rootSaga"
import reducers from "./rootReducer"

const sagaMiddleware = createSagaMiddleware()
const reduxRouterMiddleware = routerMiddleware()
const middlewares = [sagaMiddleware, reduxRouterMiddleware]

let store = createStore(combineReducers(
    {...reducers, router: routerReducer}),
    composeWithDevTools(applyMiddleware(...middlewares))
)

//create store
if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = combineReducers(require('./rootReducer'))
      store.replaceReducer(nextRootReducer)
    })
}

sagaMiddleware.run(rootSaga)

export default store
