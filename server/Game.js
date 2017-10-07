const mongoose = require("mongoose")

const GameSchema = new mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Game = mongoose.model("Game", GameSchema)

module.exports = Game
