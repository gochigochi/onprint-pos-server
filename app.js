require('dotenv').config()
const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")
const crypto = require("crypto")
const bodyParser = require("body-parser")

const app = express()
const httpServer = createServer(app)

// WOOCOMMERCE CERT
const baseUrl = process.env.STORE_URL
const ck = process.env.WOO_CONSUMER_KEY
const cs = process.env.WOO_SECRET_KEY
const auth = btoa(`${ck}:${cs}`)

app.use(cors())
app.use(express.json())

app.post("/webhook/new-order", async (req, res) => {

    // const secret = 'b{Vy/V{rb%fjc<jKaORyoMdt1tQ9$OzyRlVb|#lCTdZjrPKjgI'
    const signature = req.headers['x-wc-webhook-signature']

    console.log("SIGNATURE", signature)

    // const payload = JSON.stringify(req.body)

    console.log("PAYLOAD...", payload)
    // THE ISSUE: PAYLOAD RECEIVED HERE IN BODY IS DIFFERENT TO THE BODY SHOWN IN THE WOOCOMMERCE WEBHOOKS LOGS!

        try {

            // const secret = 'b{Vy/V{rb%fjc<jKaORyoMdt1tQ9$OzyRlVb|#lCTdZjrPKjgI'
            // const signature = req.headers['x-wc-webhook-signature']

            // console.log(req.rawBody)
    s
            const payload = await rawBody(req)
            // const payload2 = JSON.stringify(req.body)
            // const payload3 = req.body.toString()



            const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64')
            // const hmac2 = crypto.createHmac('sha256', secret).update(payload2).digest('base64')
            // const hmac3 = crypto.createHmac('sha256', secret).update(payload3).digest('base64')

            // const rawReqBody = await rawBody(req)
            // const hmac = crypto.createHmac('sha256', secret).update(rawReqBody).digest('base64')

            // SEND ALL THE DATA AS POSSIBLE
            const response = {
                success: true,
                payload: payload,
                payload2,
                // payload3,
                secret: secret,
                signature: signature,
                hmac,
                // hmac2,
                // hmac3,
            }

            io.emit("new-order", response)
            // res.send({ ok: true }).status(200)

        } catch (err) {

            console.log("Catched Error..", err)
            res.send({ ok: false, msg: err }).status(500)
        }
})

// GET ORDERS
app.get("/api/orders", async (req, res) => {

    const url = `${baseUrl}orders?page=${req.query.page}&per_page=20`
    const nextPage = parseInt(req.query.page) + 1
    const nextUrl = `${baseUrl}orders?page=${nextPage}`

    let orders
    let hasNextPage

    try {

        const wooResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
        })

        orders = await wooResponse.json()

        const nextResponse = await fetch(nextUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
        })

        const nextResult = await nextResponse.json()

        hasNextPage = nextResult.length > 0

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })
    }

    res.status(200).send({ orders: orders, hasNextPage })
})

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


httpServer.listen(8080, () => {
    console.log("server started at 8080")
})