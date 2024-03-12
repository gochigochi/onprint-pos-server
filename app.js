const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")

const app = express()
const httpServer = createServer(app)

app.use(cors())

//FOR PROD
const io = new Server(httpServer)

//FOR DEV
// const io = new Server(httpServer, {
//     cors: {
//         origin: "http://localhost:5173"
//     }
// })

//FOR PRODUCTION
app.use(express.static('dist'))

io.on("connection", socket => {
    console.log("user connected")
})

app.get("/api/new-order", (req, res) => {
    // HERE CHECK IF PAYMENT AND IDS ARE VALIDS - SECURITY
    // CHECK REQ DATA TO PASS TO TICKET!
    io.emit("new-order", { success: true })
    res.send("ok").status(200)
})

httpServer.listen(8080, () => {
    console.log("server started at 8080")
})