require('dotenv').config()
const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")
const crypto = require("crypto")
const rawBody = require("raw-body")
const bodyParser = require("body-parser")

const app = express()
const httpServer = createServer(app)

app.use(cors())
app.use(express.json());
app.use(bodyParser.json())


// const payload = JSON.stringify(req.body);
// const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64')


// // const rawReqBody = await rawBody(req)
// // const hmac = crypto.createHmac('sha256', secret).update(rawReqBody).digest('base64')

// // SEND ALL THE DATA AS POSSIBLE
// const response = {
//     success: true,
//     payload: payload,
//     secret: secret,
//     signature: signature,
//     hmac: hmac,
// }

const jsonLiteral = "{\"id\":1379,\"parent_id\":0,\"status\":\"processing\",\"currency\":\"CHF\",\"version\":\"7.0.0\",\"prices_include_tax\":false,\"date_created\":\"2024-03-27T20:54:20\",\"date_modified\":\"2024-03-27T20:54:20\",\"discount_total\":\"0.00\",\"discount_tax\":\"0.00\",\"shipping_total\":\"0.00\",\"shipping_tax\":\"0.00\",\"cart_tax\":\"0.00\",\"total\":\"0.00\",\"total_tax\":\"0.00\",\"customer_id\":0,\"order_key\":\"wc_order_BQ1YQkj6bNGhI\",\"billing\":{\"first_name\":\"test231321\",\"last_name\":\"\",\"company\":\"\",\"address_1\":\"\",\"address_2\":\"\",\"city\":\"\",\"state\":\"\",\"postcode\":\"\",\"country\":\"\",\"email\":\"\",\"phone\":\"\"},\"shipping\":{\"first_name\":\"test231321\",\"last_name\":\"\",\"company\":\"\",\"address_1\":\"santa fe 2888\",\"address_2\":\"\",\"city\":\"buenos aires\",\"state\":\"\",\"postcode\":\"\",\"country\":\"argentina\",\"phone\":\"\"},\"payment_method\":\"bacs\",\"payment_method_title\":\"Direct Bank Transfer\",\"transaction_id\":\"\",\"customer_ip_address\":\"\",\"customer_user_agent\":\"\",\"created_via\":\"rest-api\",\"customer_note\":\"\",\"date_completed\":null,\"date_paid\":\"2024-03-27T20:54:20\",\"cart_hash\":\"\",\"number\":\"211\",\"meta_data\":[{\"id\":29660,\"key\":\"_order_number\",\"value\":\"211\"},{\"id\":29667,\"key\":\"_new_order_email_sent\",\"value\":\"true\"},{\"id\":29668,\"key\":\"etn_attendee_ticket_email_sent_on_order_placement\",\"value\":\"1\"}],\"line_items\":[{\"id\":920,\"name\":\"MARTINI COCKTAIL\",\"product_id\":1189,\"variation_id\":0,\"quantity\":1,\"tax_class\":\"\",\"subtotal\":\"0.00\",\"subtotal_tax\":\"0.00\",\"total\":\"0.00\",\"total_tax\":\"0.00\",\"taxes\":[],\"meta_data\":[],\"sku\":\"\",\"price\":0,\"image\":{\"id\":\"1183\",\"src\":\"https://resto-demo.ch/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-20-at-15.57.40.jpeg\"},\"parent_name\":null}],\"tax_lines\":[],\"shipping_lines\":[],\"fee_lines\":[],\"coupon_lines\":[],\"refunds\":[],\"payment_url\":\"https://resto-demo.ch/checkout/order-pay/1379/?pay_for_order=true&key=wc_order_BQ1YQkj6bNGhI\",\"is_editable\":true,\"needs_payment\":false,\"needs_processing\":true,\"date_created_gmt\":\"2024-03-27T20:54:20\",\"date_modified_gmt\":\"2024-03-27T20:54:20\",\"date_completed_gmt\":null,\"date_paid_gmt\":\"2024-03-27T20:54:20\",\"currency_symbol\":\"CHF\",\"_links\":{\"self\":[{\"href\":\"https://resto-demo.ch/wp-json/wc/v3/orders/1379\"}],\"collection\":[{\"href\":\"https://resto-demo.ch/wp-json/wc/v3/orders\"}]}}"


const secret = 'b{Vy/V{rb%fjc<jKaORyoMdt1tQ9$OzyRlVb|#lCTdZjrPKjgI'

const tempSignature = 'SVoUCkmpNjkyl1IX9O63N0BncMzTx7smGkQRkrTyAYE='

const tempBody = '{"id":1379,"parent_id":0,"status":"processing","currency":"CHF","version":"7.0.0","prices_include_tax":false,"date_created":"2024-03-27T20:54:20","date_modified":"2024-03-27T20:54:20","discount_total":"0.00","discount_tax":"0.00","shipping_total":"0.00","shipping_tax":"0.00","cart_tax":"0.00","total":"0.00","total_tax":"0.00","customer_id":0,"order_key":"wc_order_BQ1YQkj6bNGhI","billing":{"first_name":"test231321","last_name":"","company":"","address_1":"","address_2":"","city":"","state":"","postcode":"","country":"","email":"","phone":""},"shipping":{"first_name":"test231321","last_name":"","company":"","address_1":"santa fe 2888","address_2":"","city":"buenos aires","state":"","postcode":"","country":"argentina","phone":""},"payment_method":"bacs","payment_method_title":"Direct Bank Transfer","transaction_id":"","customer_ip_address":"","customer_user_agent":"","created_via":"rest-api","customer_note":"","date_completed":null,"date_paid":"2024-03-27T20:54:20","cart_hash":"","number":"211","meta_data":[{"id":29660,"key":"_order_number","value":"211"},{"id":29667,"key":"_new_order_email_sent","value":"true"},{"id":29668,"key":"etn_attendee_ticket_email_sent_on_order_placement","value":"1"}],"line_items":[{"id":920,"name":"MARTINI COCKTAIL","product_id":1189,"variation_id":0,"quantity":1,"tax_class":"","subtotal":"0.00","subtotal_tax":"0.00","total":"0.00","total_tax":"0.00","taxes":[],"meta_data":[],"sku":"","price":0,"image":{"id":"1183","src":"https://resto-demo.ch/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-20-at-15.57.40.jpeg"},"parent_name":null}],"tax_lines":[],"shipping_lines":[],"fee_lines":[],"coupon_lines":[],"refunds":[],"payment_url":"https://resto-demo.ch/checkout/order-pay/1379/?pay_for_order=true&key=wc_order_BQ1YQkj6bNGhI","is_editable":true,"needs_payment":false,"needs_processing":true,"date_created_gmt":"2024-03-27T20:54:20","date_modified_gmt":"2024-03-27T20:54:20","date_completed_gmt":null,"date_paid_gmt":"2024-03-27T20:54:20","currency_symbol":"CHF","_links":{"self":[{"href":"https://resto-demo.ch/wp-json/wc/v3/orders/1379"}],"collection":[{"href":"https://resto-demo.ch/wp-json/wc/v3/orders"}]}}'

const copiedFromLog = "{\"id\":1379,\"parent_id\":0,\"status\":\"processing\",\"currency\":\"CHF\",\"version\":\"7.0.0\",\"prices_include_tax\":false,\"date_created\":\"2024-03-27T20:54:20\",\"date_modified\":\"2024-03-27T20:54:20\",\"discount_total\":\"0.00\",\"discount_tax\":\"0.00\",\"shipping_total\":\"0.00\",\"shipping_tax\":\"0.00\",\"cart_tax\":\"0.00\",\"total\":\"0.00\",\"total_tax\":\"0.00\",\"customer_id\":0,\"order_key\":\"wc_order_BQ1YQkj6bNGhI\",\"billing\":{\"first_name\":\"test231321\",\"last_name\":\"\",\"company\":\"\",\"address_1\":\"\",\"address_2\":\"\",\"city\":\"\",\"state\":\"\",\"postcode\":\"\",\"country\":\"\",\"email\":\"\",\"phone\":\"\"},\"shipping\":{\"first_name\":\"test231321\",\"last_name\":\"\",\"company\":\"\",\"address_1\":\"santa fe 2888\",\"address_2\":\"\",\"city\":\"buenos aires\",\"state\":\"\",\"postcode\":\"\",\"country\":\"argentina\",\"phone\":\"\"},\"payment_method\":\"bacs\",\"payment_method_title\":\"Direct Bank Transfer\",\"transaction_id\":\"\",\"customer_ip_address\":\"\",\"customer_user_agent\":\"\",\"created_via\":\"rest-api\",\"customer_note\":\"\",\"date_completed\":null,\"date_paid\":\"2024-03-27T20:54:20\",\"cart_hash\":\"\",\"number\":\"211\",\"meta_data\":[{\"id\":29660,\"key\":\"_order_number\",\"value\":\"211\"},{\"id\":29667,\"key\":\"_new_order_email_sent\",\"value\":\"true\"},{\"id\":29668,\"key\":\"etn_attendee_ticket_email_sent_on_order_placement\",\"value\":\"1\"}],\"line_items\":[{\"id\":920,\"name\":\"MARTINI COCKTAIL\",\"product_id\":1189,\"variation_id\":0,\"quantity\":1,\"tax_class\":\"\",\"subtotal\":\"0.00\",\"subtotal_tax\":\"0.00\",\"total\":\"0.00\",\"total_tax\":\"0.00\",\"taxes\":[],\"meta_data\":[],\"sku\":\"\",\"price\":0,\"image\":{\"id\":\"1183\",\"src\":\"https:\\/\\/resto-demo.ch\\/wp-content\\/uploads\\/2023\\/12\\/WhatsApp-Image-2023-12-20-at-15.57.40.jpeg\"},\"parent_name\":null}],\"tax_lines\":[],\"shipping_lines\":[],\"fee_lines\":[],\"coupon_lines\":[],\"refunds\":[],\"payment_url\":\"https:\\/\\/resto-demo.ch\\/checkout\\/order-pay\\/1379\\/?pay_for_order=true&key=wc_order_BQ1YQkj6bNGhI\",\"is_editable\":true,\"needs_payment\":false,\"needs_processing\":true,\"date_created_gmt\":\"2024-03-27T20:54:20\",\"date_modified_gmt\":\"2024-03-27T20:54:20\",\"date_completed_gmt\":null,\"date_paid_gmt\":\"2024-03-27T20:54:20\",\"currency_symbol\":\"CHF\",\"_links\":{\"self\":[{\"href\":\"https:\\/\\/resto-demo.ch\\/wp-json\\/wc\\/v3\\/orders\\/1379\"}],\"collection\":[{\"href\":\"https:\\/\\/resto-demo.ch\\/wp-json\\/wc\\/v3\\/orders\"}]}}"

const stringifiedBody = JSON.stringify(`{\"id\":1378,\"parent_id\":0,\"status\":\"processing\",\"currency\":\"CHF\",\"version\":\"7.0.0\",\"prices_include_tax\":false,\"date_created\":\"2024-03-27T18:04:27\",\"date_modified\":\"2024-03-27T18:04:28\",\"discount_total\":\"0.00\",\"discount_tax\":\"0.00\",\"shipping_total\":\"0.00\",\"shipping_tax\":\"0.00\",\"cart_tax\":\"0.00\",\"total\":\"14.00\",\"total_tax\":\"0.00\",\"customer_id\":0,\"order_key\":\"wc_order_Fv4TLfLah3dnm\",\"billing\":{\"first_name\":\"test hash\",\"last_name\":\"\",\"company\":\"\",\"address_1\":\"\",\"address_2\":\"\",\"city\":\"\",\"state\":\"\",\"postcode\":\"\",\"country\":\"\",\"email\":\"\",\"phone\":\"\"},\"shipping\":{\"first_name\":\"test hash\",\"last_name\":\"\",\"company\":\"\",\"address_1\":\"santa fe 2888\",\"address_2\":\"\",\"city\":\"buenos aires\",\"state\":\"\",\"postcode\":\"\",\"country\":\"argentina\",\"phone\":\"\"},\"payment_method\":\"bacs\",\"payment_method_title\":\"Direct Bank Transfer\",\"transaction_id\":\"\",\"customer_ip_address\":\"\",\"customer_user_agent\":\"\",\"created_via\":\"rest-api\",\"customer_note\":\"\",\"date_completed\":null,\"date_paid\":\"2024-03-27T18:04:28\",\"cart_hash\":\"\",\"number\":\"210\",\"meta_data\":[{\"id\":29630,\"key\":\"_order_number\",\"value\":\"210\"},{\"id\":29637,\"key\":\"_new_order_email_sent\",\"value\":\"true\"},{\"id\":29638,\"key\":\"etn_attendee_ticket_email_sent_on_order_placement\",\"value\":\"1\"}],\"line_items\":[{\"id\":918,\"name\":\"ORANGENSAFT\",\"product_id\":1068,\"variation_id\":0,\"quantity\":1,\"tax_class\":\"\",\"subtotal\":\"7.50\",\"subtotal_tax\":\"0.00\",\"total\":\"7.50\",\"total_tax\":\"0.00\",\"taxes\":[],\"meta_data\":[],\"sku\":\"\",\"price\":7.5,\"image\":{\"id\":\"1183\",\"src\":\"https:\\/\\/resto-demo.ch\\/wp-content\\/uploads\\/2023\\/12\\/WhatsApp-Image-2023-12-20-at-15.57.40.jpeg\"},\"parent_name\":null},{\"id\":919,\"name\":\"MINERALWASSER\",\"product_id\":1104,\"variation_id\":0,\"quantity\":1,\"tax_class\":\"\",\"subtotal\":\"6.50\",\"subtotal_tax\":\"0.00\",\"total\":\"6.50\",\"total_tax\":\"0.00\",\"taxes\":[],\"meta_data\":[],\"sku\":\"\",\"price\":6.5,\"image\":{\"id\":\"1183\",\"src\":\"https:\\/\\/resto-demo.ch\\/wp-content\\/uploads\\/2023\\/12\\/WhatsApp-Image-2023-12-20-at-15.57.40.jpeg\"},\"parent_name\":null}],\"tax_lines\":[],\"shipping_lines\":[],\"fee_lines\":[],\"coupon_lines\":[],\"refunds\":[],\"payment_url\":\"https:\\/\\/resto-demo.ch\\/checkout\\/order-pay\\/1378\\/?pay_for_order=true&key=wc_order_Fv4TLfLah3dnm\",\"is_editable\":true,\"needs_payment\":false,\"needs_processing\":true,\"date_created_gmt\":\"2024-03-27T18:04:27\",\"date_modified_gmt\":\"2024-03-27T18:04:28\",\"date_completed_gmt\":null,\"date_paid_gmt\":\"2024-03-27T18:04:28\",\"currency_symbol\":\"CHF\",\"_links\":{\"self\":[{\"href\":\"https:\\/\\/resto-demo.ch\\/wp-json\\/wc\\/v3\\/orders\\/1378\"}],\"collection\":[{\"href\":\"https:\\/\\/resto-demo.ch\\/wp-json\\/wc\\/v3\\/orders\"}]}}`)

console.log(secret)

console.log("TEMP....", typeof copiedFromLog)
console.log("STR....", typeof stringifiedBody)

const hmac1 = crypto.createHmac('sha256', secret).update(copiedFromLog).digest('base64')
const hmac2 = crypto.createHmac('sha256', secret).update(stringifiedBody).digest('base64')

console.log("HMAC1......", hmac1 )
console.log("HMAC2......", hmac2 )

httpServer.listen(8082, () => {
    console.log("server started at 8080")
})