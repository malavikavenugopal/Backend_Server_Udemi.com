const express = require("express")

const mongoose = require("mongoose")

const bodyParser = require("body-parser")

const HttpError = require('./models/http-error')
const cors = require('cors')

const server = express()

server.use(cors())

server.use(express.json())

const placesRoutes = require('./routes/places-routes')

server.use(placesRoutes)
//handling errors for unsupported routes

const userRoutes = require('./routes/user-routes')

server.use(userRoutes)

server.use((req, res, next) => {
    //new HttpError(message: any, errorCode: any)
    const error = new HttpError('Could not find this route ', 404)
    throw error;
})
const PORT = 8000

//error handling
server.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' });
})

//mongoose.ConnectOptions | undefined): Promise<typeof mongoose>
mongoose.connect('mongodb+srv://malavikavenu914:snjy5678@cluster0.8duiran.mongodb.net/mern?retryWrites=true&w=majority').then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at Port ${PORT}`);
    })

}).catch((err) => {
    console.log(err);
})


