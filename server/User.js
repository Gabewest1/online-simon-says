const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    xp: Number,
    onlineMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }]
})

const User = mongoose.model("User", UserSchema)

module.exports = User
