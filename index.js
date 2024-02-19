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


