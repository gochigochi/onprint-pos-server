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
app.get("/api/products/:id", async (req, res) => {

    const url = `${baseUrl}products?category=${req.params.id}&per_page=100`
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
        
        console.log("RESULT", result)

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }

    res.status(200).send({ categories: result })
})

// REPORTS
app.get("/api/reports/sales", async (req, res) => {

    const url = `${baseUrl}reports/sales`
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
        
        console.log("RESULT", result)

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }

    console.log(result)
    res.status(200).send({ data: result })
})

// TOTAL ORDERS
app.get("/api/total-orders-report", async (req, res) => {

    const url = `${baseUrl}reports/orders/totals`
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
        
        console.log("RESULT", result)

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }

    console.log(result)
    res.status(200).send({ data: result })
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


// CRETE NEW ORDER
app.post("/api/new-order", async (req, res) => {

    // create woo order
    const url = `${baseUrl}orders`

    let result

    //req.body schema:
    // {
    //     products: [],
    //     isStore: true/false
    //     storeId: store1/store2... //define printer
    // }

    const data = req.body

    console.log(data)

    // TODO format order
    const order = {
        payment_method: 'bacs',
        payment_method_title: 'Direct Bank Transfer',
        set_paid: true,
        billing: {
            first_name: data.customer,
            // last_name: 'Doe',
            // address_1: '969 Market',
            // address_2: '',
            // city: 'San Francisco',
            // state: 'CA',
            // postcode: '94103',
            // country: 'US',
            // email: 'john.doe@example.com',
            // phone: '(555) 555-5555',
        },
        shipping: {
            first_name: data.customer,
            // last_name: 'Doe',
            address_1: data.address,
            // address_2: '',
            city: data.city,
            // state: 'CA',
            postcode: data.postcode,
            country: data.country,
        },
        line_items: data.products
    }

    try {

        const wooResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
            },
            body: JSON.stringify(order),
        })

        result = await wooResponse.json()

    } catch (err) {

        res.status(500).send({ ok: false, msg: err })

    }
    
    io.emit("new-order", { success: true, data: result })

    res.send({ ok: true, result: result }).status(200)
})

httpServer.listen(8080, () => {
    console.log("server started at 8080")
})