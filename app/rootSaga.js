import { sagas as authSagas} from "./redux/Auth"

const root = function* rootSaga() {
    yield [
        authSagas()
    ]
}

export default root
