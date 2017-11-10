import { expect } from "chai"
import sinon from "sinon"

class SocketMock {
    constructor(testFn) {
        this.testFn = testFn || function() {}
        this.id = Math.random() * 1000
    }
    emit(event, action) {
        this.testFn(action)
    }
}

describe("GameManager", () => {
    let gameRoomManager
    const TWO_PLAYER_GAME = 2
    const THREE_PLAYER_GAME = 3
    const FOUR_PLAYER_GAME = 4

    beforeEach(done => {
        gameRoomManager = new (require("../server/GameRoomManager"))()
        done()
    })

    it("should find the player a two player game room", () => {
        const client = new SocketMock()

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)

        const playersGameRoom = gameRoomManager.findPlayersGameRoom(client)

        expect(playersGameRoom.playersNeededToStart).to.equal(2)
        expect(playersGameRoom.players[0]).to.equal(client)
    })

    it("should find the player a three player game room", () => {
        const client = new SocketMock()

        gameRoomManager.findMatch(client, THREE_PLAYER_GAME)

        const playersGameRoom = gameRoomManager.findPlayersGameRoom(client)

        expect(playersGameRoom.playersNeededToStart).to.equal(3)
        expect(playersGameRoom.players[0]).to.equal(client)
    })

    it("should find the player a four player game room", () => {
        const client = new SocketMock()

        gameRoomManager.findMatch(client, FOUR_PLAYER_GAME)

        const playersGameRoom = gameRoomManager.findPlayersGameRoom(client)

        expect(playersGameRoom.playersNeededToStart).to.equal(4)
        expect(playersGameRoom.players[0]).to.equal(client)
    })

    it("should have 1 two player game room setup after adding 1 players", () => {
        const client = new SocketMock()

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(0)

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(1)
    })

    it("should have 1 game room setup when two players search for a two player match", () => {
        const client = new SocketMock()
        const client2 = new SocketMock()

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(0)
        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client2, TWO_PLAYER_GAME)
        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(1)
    })

    it("should have 1 game room setup when three players search for a three player match", () => {
        const client = new SocketMock()
        const client2 = new SocketMock()
        const client3 = new SocketMock()

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(0)
        gameRoomManager.findMatch(client, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client2, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client3, THREE_PLAYER_GAME)
        expect(gameRoomManager.gameRooms[THREE_PLAYER_GAME].length).to.equal(1)
    })

    it("should have 1 game room setup when four players search for a four player match", () => {
        const client = new SocketMock()
        const client2 = new SocketMock()
        const client3 = new SocketMock()
        const client4 = new SocketMock()

        expect(gameRoomManager.gameRooms[FOUR_PLAYER_GAME].length).to.equal(0)
        gameRoomManager.findMatch(client, FOUR_PLAYER_GAME)
        expect(gameRoomManager.gameRooms[FOUR_PLAYER_GAME].length).to.equal(1)
        gameRoomManager.findMatch(client2, FOUR_PLAYER_GAME)
        gameRoomManager.findMatch(client3, FOUR_PLAYER_GAME)
        gameRoomManager.findMatch(client4, FOUR_PLAYER_GAME)
        expect(gameRoomManager.gameRooms[FOUR_PLAYER_GAME].length).to.equal(1)
    })

    it("should have 2 game rooms setup after three players search for a two player match", () => {
        const client = new SocketMock()
        const client2 = new SocketMock()
        const client3 = new SocketMock()

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client2, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client3, TWO_PLAYER_GAME)

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(2)
    })

    it("should have 2 game rooms setup after four players search for a two player match", () => {
        const client = new SocketMock()
        const client2 = new SocketMock()
        const client3 = new SocketMock()
        const client4 = new SocketMock()

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client2, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client3, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client4, TWO_PLAYER_GAME)

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(2)
    })

    it("should have 2 game rooms setup after four players search for a three player match", () => {
        const client = new SocketMock()
        const client2 = new SocketMock()
        const client3 = new SocketMock()
        const client4 = new SocketMock()

        gameRoomManager.findMatch(client, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client2, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client3, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client4, THREE_PLAYER_GAME)

        expect(gameRoomManager.gameRooms[THREE_PLAYER_GAME].length).to.equal(2)
    })

    it("should have 2 game rooms setup after six players search for a three player match", () => {
        const clients = [1, 2, 3, 4, 5, 6].map(client => new SocketMock())

        clients.forEach(client => gameRoomManager.findMatch(client, THREE_PLAYER_GAME))

        expect(gameRoomManager.gameRooms[THREE_PLAYER_GAME].length).to.equal(2)
    })

    it("should have 2 game rooms setup after eight players search for a four player match", () => {
        const clients = [1, 2, 3, 4, 5, 6, 7, 8].map(client => new SocketMock())

        clients.forEach(client => gameRoomManager.findMatch(client, FOUR_PLAYER_GAME))

        expect(gameRoomManager.gameRooms[FOUR_PLAYER_GAME].length).to.equal(2)
    })

    it("should alert players when a two player match is ready", () => {
        const testFn = action => {
            expect(action.type).to.equal("FOUND_MATCH")
        }
        const client = new SocketMock(testFn)
        const client2 = new SocketMock(testFn)

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.findMatch(client2, TWO_PLAYER_GAME)
    })

    it("should alert players when a three player match is ready", () => {
        const testFn = action => {
            expect(action.type).to.equal("FOUND_MATCH")
        }
        const client = new SocketMock(testFn)
        const client2 = new SocketMock(testFn)
        const client3 = new SocketMock(testFn)

        gameRoomManager.findMatch(client, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client2, THREE_PLAYER_GAME)
        gameRoomManager.findMatch(client3, THREE_PLAYER_GAME)
    })

    it("should alert players when a two four match is ready", () => {
        const testFn = action => {
            expect(action.type).to.equal("FOUND_MATCH")
        }
        const client = new SocketMock(testFn)
        const client2 = new SocketMock(testFn)
        const client3 = new SocketMock(testFn)
        const client4 = new SocketMock(testFn)

        gameRoomManager.findMatch(client, FOUR_PLAYER_GAME)
        gameRoomManager.findMatch(client2, FOUR_PLAYER_GAME)
        gameRoomManager.findMatch(client3, FOUR_PLAYER_GAME)
        gameRoomManager.findMatch(client4, FOUR_PLAYER_GAME)
    })

    it("should find the game room containing a given player's socket", () => {
        const client = new SocketMock()
        let foundGameRoom = false

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        const gameRoom = gameRoomManager.findPlayersGameRoom(client)

        if (gameRoom.lobby.indexOf(client) !== -1) {
            foundGameRoom = true
        } else {
            foundGameRoom = false
        }

        expect(foundGameRoom).to.equal(true)
    })

    it("should return undefined when looking for a game room of a non-existant player", () => {
        const client = new SocketMock()
        const gameRoom = gameRoomManager.findPlayersGameRoom(client)
        expect(gameRoom).equal(undefined)
    })

    it("should remove a player from game room", () => {
        const client = new SocketMock()

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        expect(gameRoomManager.findPlayersGameRoom(client)).to.not.equal(undefined)
        gameRoomManager.cancelSearch(client)
        expect(gameRoomManager.findPlayersGameRoom(client)).to.equal(undefined)
    })

    it("should add and remove a client 5 times and there be 1 game room", () => {
        const client = new SocketMock()

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.cancelSearch(client)

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.cancelSearch(client)

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.cancelSearch(client)

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.cancelSearch(client)

        gameRoomManager.findMatch(client, TWO_PLAYER_GAME)
        gameRoomManager.cancelSearch(client)

        expect(gameRoomManager.gameRooms[TWO_PLAYER_GAME].length).to.equal(1)
    })
})
