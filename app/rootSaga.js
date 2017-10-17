import { sagas as authSagas} from "./redux/Auth"
import { sagas as simonSaysGameSagas} from "./redux/SimonSaysGame"
import { sagas as leaderboardsSagas} from "./redux/Leaderboards"

const root = function* rootSaga() {
    yield [
        authSagas(),
        simonSaysGameSagas(),
        leaderboardsSagas()
    ]
}

export default root
