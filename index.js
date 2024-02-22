const express = require("express")

const mongoose = require("mongoose")

const HttpError = require('./models/http-error')

const cors = require('cors')

const server = express()

server.use(cors())

server.use(express.json())

//User Router
const userRoutes = require('./router/user-routes')
server.use('/users',userRoutes)

//Pet Router
const petRoutes = require('./router/pet-routes')
server.use('/pets',petRoutes)

//Product Router
const productRoutes= require('./router/product-routes')
server.use('/products', productRoutes)

//Veterinary Router
const veterinaryRoutes= require('./router/veterinary-routes')
server.use('/veterinary', veterinaryRoutes)

//Cart Router
const cartRoutes= require('./router/cart-routes')
server.use('/cart', cartRoutes)

//Checkout Router
const checkoutRoutes= require('./router/checkout-routes')
server.use('/order', checkoutRoutes)

//Review Router
const reviewRoutes= require('./router/review-routes')
server.use('/review',reviewRoutes)

//Board Router
const boardRoutes= require('./router/board-routes')
server.use('/board',boardRoutes)

//Groom Router
const groomRoutes= require('./router/groom-routes')
server.use('/groom',groomRoutes)

//Device Router
const deviceRoutes= require('./router/device-routes')
server.use('/device',deviceRoutes)

server.use('/uploads',express.static('./uploads'))

server.use((req, res, next) => {
    const error = new HttpError('Could not find this route ', 404)
    throw error;
})

const PORT = 4000 || process.env.PORT

//error handling
server.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
})

mongoose.connect('mongodb+srv://malavikavenu914:snjy5678@cluster0.8duiran.mongodb.net/petcare?retryWrites=true&w=majority').then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at Port ${PORT}`);
        console.log('MongoDB connected successfully')
    })

}).catch((err) => {
    console.log(err);
})


