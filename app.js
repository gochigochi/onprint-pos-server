require('dotenv').config()
const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")

const app = express()
const httpServer = createServer(app)

// WOOCOMMERCE CERT
const baseUrl = process.env.STORE_URL
const ck = process.env.WOO_CONSUMER_KEY
const cs = process.env.WOO_SECRET_KEY
const auth = btoa(`${ck}:${cs}`)

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

// PRODUCTS BY CATEGORY
app.post("/api/products", async (req, res) => {
    // https://resto-demo.ch/wp-json/wc/v3/products?category=36
    const url = `${baseUrl}products?category=${req.body.id}&per_page=100`
    let result

    try {

        const wooResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
        })

        result = await wooResponse.json()

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }

    res.status(200).send({ products: result })
})

// CATEGORIES
app.get("/api/categories", async (req, res) => {

    const url = `${baseUrl}products/categories`
    let result

    try {

        const wooResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${auth}`,
            },
        })

        result = await wooResponse.json()

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }

    res.status(200).send({ categories: result })
})

// CRETE NEW ORDER
app.post("/api/new-order", async (req, res) => {

    // create woo order
    const url = `${baseUrl}orders`

    //req.body schema:
    // {
    //     products: [],
    //     isStore: true/false
    //     storeId: store1/store2... //define printer
    // }

    // TODO get products data from woo
    console.log(req.body.products)

    // TODO format order
    const data = {
        payment_method: 'bacs',
        payment_method_title: 'Direct Bank Transfer',
        set_paid: true,
        billing: {
            first_name: 'John',
            last_name: 'Doe',
            address_1: '969 Market',
            address_2: '',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94103',
            country: 'US',
            email: 'john.doe@example.com',
            phone: '(555) 555-5555',
        },
        shipping: {
            first_name: 'Takeaway',
            last_name: 'Doe',
            address_1: '969 Market',
            address_2: '',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94103',
            country: 'US',
        },
        line_items: [
            {
                product_id: req.body.id,
                quantity: 1,
            },
        ],
        shipping_lines: [
            {
                method_id: 'flat_rate',
                method_title: 'Flat Rate',
                total: '10.00',
            },
        ],
    };

    try {

        const wooResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify(data),
        })

        const result = await wooResponse.json()

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }

    const orderData = req.body
    
    io.emit("new-order", { success: true, data: orderData, isStore: true })

    res.send({ ok: true }).status(200)
})

httpServer.listen(8080, () => {
    console.log("server started at 8080")
})