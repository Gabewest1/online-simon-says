import { sagas as authSagas} from "./redux/Auth"
import { sagas as simonSaysGameSagas} from "./redux/SimonSaysGame"
import { sagas as leaderboardsSagas} from "./redux/Leaderboards"
import { sagas as navigatorSagas} from "./redux/Navigator"

const root = function* rootSaga() {
    yield [
        authSagas(),
        simonSaysGameSagas(),
        leaderboardsSagas(),
        navigatorSagas()
    ]
}

export default root
