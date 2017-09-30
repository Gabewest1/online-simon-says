const fs = require("fs")
const path = require("path")

const reduxSocketIOPath = path.resolve(__dirname, "node_modules", "redux-socket.io", ".babelrc")

const pathsToBabelrcFiles = [reduxSocketIOPath]

//Delete all the .babelrc files
pathsToBabelrcFiles.forEach(path => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
})
