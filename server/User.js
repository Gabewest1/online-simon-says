const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const GameSchema = new mongoose.Schema({
    wins: { type: Number, default: 0},
    loses: { type: Number, default: 0},
    matchesPlayed: { type: Number, default: 0},
    bestStreak: { type: Number, default: 0},
    currentStreak: { type: Number, default: 0}
})

const UserSchema = new mongoose.Schema({
    email: { type: String, lowercase: true },
    password: String,
    username: { type: String, lowercase: true },
    xp: { type: Number, default: 0 },
    loggedIn: Boolean,
    statsByGameMode: {
        1: { type: GameSchema, default: GameSchema},
        2: { type: GameSchema, default: GameSchema},
        3: { type: GameSchema, default: GameSchema},
        4: { type: GameSchema, default: GameSchema}
    }
})

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}


const User = mongoose.model("User", UserSchema)

module.exports = User
