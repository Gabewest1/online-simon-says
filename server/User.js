const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const SinglePlayerGameSchema = new mongoose.Schema({
    matchesPlayed: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 }
})

const MultiplayerGameSchema = new mongoose.Schema({
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 }
})

const UserSchema = new mongoose.Schema({
    email: { type: String, lowercase: true },
    password: String,
    username: { type: String, lowercase: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    loggedIn: Boolean,
    statsByGameMode: {
        1: { type: SinglePlayerGameSchema, default: SinglePlayerGameSchema },
        2: { type: MultiplayerGameSchema, default: MultiplayerGameSchema },
        3: { type: MultiplayerGameSchema, default: MultiplayerGameSchema },
        4: { type: MultiplayerGameSchema, default: MultiplayerGameSchema }
    }
})

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.calculateLevel = function(xp) {
    const levelToXpMap = generateLevelMap()
    
    const level = Object.keys(levelToXpMap).reverse().find((level) => {
        const xpRequired = levelToXpMap[level]
        
        return xpRequired <= xp
    }, 1)
    
    console.log("YOU ARE LEVEL:", level)
    
    return level
}

function generateLevelMap() {
    const levelToXpMap = {}
    const fn = level => (level * 100) - 100

    for (let level = 1; level<=100; level++) {
        levelToXpMap[level] = fn(level)
    }

    // console.log("LEVELTOXP MAP:", levelToXpMap)

    return levelToXpMap
}


const User = mongoose.model("User", UserSchema)

module.exports = User
