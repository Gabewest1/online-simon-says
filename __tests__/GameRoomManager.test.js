const chai = require("chai")
const expect = chai.expect

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

    beforeEach(done => {
        gameRoomManager = new (require("../server/GameRoomManager"))()
        done()
    })

    it("should add a player to a game room", done => {
        let client = new SocketMock()
        gameRoomManager.addPlayer(client)

        let playersGameRoom = gameRoomManager.findPlayersGameRoom(client)
        expect(playersGameRoom.players[0]).to.equal(client)

        done()
    })

    it("should add a spectator to a game room", done => {
        let client = new SocketMock()

        gameRoomManager.addSpectator(client)

        let playersGameRoom = gameRoomManager.findPlayersGameRoom(client)

        expect(playersGameRoom.spectators[0]).to.equal(client)

        done()
    })

    it("should have 1 game room setup after adding 1 players", done => {
        let client = new SocketMock()
        gameRoomManager.addPlayer(client)
        expect(gameRoomManager.gameRooms.length).to.equal(1)

        done()
    })

    it("should have 1 game room setup after adding 2 players", done => {
        let client = new SocketMock()
        let client2 = new SocketMock()
        gameRoomManager.addPlayer(client)
        gameRoomManager.addPlayer(client2)
        expect(gameRoomManager.gameRooms.length).to.equal(1)

        done()
    })

    it("should have 2 game rooms setup after adding 3 players", done => {
        let client = new SocketMock()
        let client2 = new SocketMock()
        let client3 = new SocketMock()

        gameRoomManager.addPlayer(client)
        gameRoomManager.addPlayer(client2)
        gameRoomManager.addPlayer(client3)

        expect(gameRoomManager.gameRooms.length).to.equal(2)

        done()
    })

    it("should have 2 game rooms setup after adding 4 players", done => {
        let client = new SocketMock()
        let client2 = new SocketMock()
        let client3 = new SocketMock()
        let client4 = new SocketMock()

        gameRoomManager.addPlayer(client)
        gameRoomManager.addPlayer(client2)
        gameRoomManager.addPlayer(client3)
        gameRoomManager.addPlayer(client4)

        expect(gameRoomManager.gameRooms.length).to.equal(2)

        done()
    })

    it("should alert everyone in a game room when 2 players are found and ready to start the match", done => {
        let testFn = action => {
            expect(action.type).to.equal("FOUND_OPPONENT")
        }
        let client = new SocketMock(testFn)
        let client2 = new SocketMock(testFn)

        gameRoomManager.addPlayer(client)

        gameRoomManager.addPlayer(client2)

        setTimeout(() => done(), 1400)
    })

    it("should find the game room containing a given player's socket", done => {
        let client = new SocketMock()
        let foundGameRoom = false

        gameRoomManager.addPlayer(client)
        let gameRoom = gameRoomManager.findPlayersGameRoom(client)

        if (gameRoom.players.indexOf(client) !== -1) {
            foundGameRoom = true
        } else {
            foundGameRoom = false
        }

        expect(foundGameRoom).to.equal(true)

        done()
    })

    it("should return undefined when looking for a game room of a non-existant player", done => {
        let client = new SocketMock()
        let gameRoom = gameRoomManager.findPlayersGameRoom(client)
        expect(gameRoom).equal(undefined)

        done()
    })

    it("should remove a player from game room", done => {
        let client = new SocketMock()
        let gameRoom

        gameRoomManager.addPlayer(client)
        gameRoomManager.removePlayer(client)
        gameRoom = gameRoomManager.findPlayersGameRoom(client)

        expect(gameRoom).to.equal(undefined)
        done()
    })

    it("should remove a spectator from game room", done => {
        let client = new SocketMock()
        let gameRoom

        gameRoomManager.addSpectator(client)
        gameRoomManager.removePlayer(client)
        gameRoom = gameRoomManager.findPlayersGameRoom(client)

        expect(gameRoom).to.equal(undefined)
        done()
    })

    it("should add and remove a client 5 times and there be 1 game room", done => {
        let client = new SocketMock()

        gameRoomManager.addPlayer(client)
        gameRoomManager.removePlayer(client)

        gameRoomManager.addPlayer(client)
        gameRoomManager.removePlayer(client)

        gameRoomManager.addPlayer(client)
        gameRoomManager.removePlayer(client)

        gameRoomManager.addPlayer(client)
        gameRoomManager.removePlayer(client)

        gameRoomManager.addPlayer(client)
        gameRoomManager.removePlayer(client)

        expect(gameRoomManager.gameRooms.length).to.equal(1)
        done()
    })
})
