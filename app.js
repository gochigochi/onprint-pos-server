const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")

const app = express()
const httpServer = createServer(app)

app.use(cors())
app.use(express.json());

//FOR PROD
// const io = new Server(httpServer)
// app.use(express.static('dist'))

//FOR DEV
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", socket => {
    console.log("user connected")
})

app.post("/api/new-order", (req, res) => {
    
    const data = req.body

    io.emit("new-order", { success: true, data: data })
    res.send("ok").status(200)
})

httpServer.listen(8080, () => {
    console.log("server started at 8080")
})