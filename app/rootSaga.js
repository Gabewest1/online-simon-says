import { sagas as authSagas} from "./redux/Auth"
import { sagas as simonSaysGameSagas} from "./redux/SimonSaysGame"

const root = function* rootSaga() {
    yield [
        authSagas(),
        simonSaysGameSagas()
    ]
}

export default root
