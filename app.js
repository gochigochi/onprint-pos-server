require('dotenv').config()
const { createLogger, transports, format } = require('winston');

const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")
const crypto = require("crypto")
const bodyParser = require("body-parser")

const app = express()
const httpServer = createServer(app)
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'webhook-logs.log' })
    ]
});
const rawBodySaver = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));
// WOOCOMMERCE CERT

const baseUrl = process.env.STORE_URL
const ck = process.env.WOO_CONSUMER_KEY
const cs = process.env.WOO_SECRET_KEY
const auth = btoa(`${ck}:${cs}`)

app.use(cors())
app.use(
    express.json({
        verify: function (req, res, buf) {
            req.rawBody = buf;
        },
    })
);

const fs = require('fs');

// Función para escribir en el archivo de logs



// Middleware para manejar el endpoint /webhook/new-order
app.post("/webhook/new-order", async (req, res) => {
    logger.info('webhook/new-order');
    const incomingSignature = req.headers["x-wc-webhook-signature"]; // modify this accordingly
    const payload = req.rawBody; // Buffer, already, no need to stringify.

    logger.info(payload);
    logger.info(incomingSignature);
    try {
        // Verificar la firma

        const calculatedSignature = crypto
            .createHmac("sha256", "b{Vy/V{rb%fjc<jKaORyoMdt1tQ9$OzyRlVb|#lCTdZjrPKjgI")
            .update(payload)
            .digest("base64");
        logger.info('Abrite una cerveza');
        logger.info(calculatedSignature);
        // if (hash !== signature) {
        //     console.log("HASH NOT MATCHED")
        //     res.send({ ok: false, msg: "Hash not matched" }).status(401)
        // } else {
        //     console.log("HASH MATCHED")
        //     res.send({ ok: true }).status(200)
        // }

        // Escribir en el archivo de logs
        // Emitir evento a los clientes conectados
        const response = {
            success: true,
            payload: payload,
            secret: secret,
            signature: signature,
            hmac,
        }
        io.emit("new-order", response);

        res.send({ ok: true }).status(200);
    } catch (err) {
        console.log("Catched Error..", err)
        res.send({ ok: false, msg: err }).status(500)
    }
});

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
    logger.info('socket OK');
})


httpServer.listen(8080, () => {
    console.log("server started at 8080")
    logger.info('server started at 8080');
})