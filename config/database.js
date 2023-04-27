const mongoose = require("mongoose")

const connectDB= async()=> {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING)
        console.log(`Mongo Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error
        process.exit(1)
    }
}

module.exports= connectDB