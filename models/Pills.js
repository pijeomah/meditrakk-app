const mongoose = require('mongoose')

const PillSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    dosage:{
        type: String,
        required: true,
    },

    frequency:{
        type: String,
        required: true,
    },

    takenAt: {
        type: Date,
        default: Date.now,
    },

    ailment: {
        type: String,
        required: true
    },

    number: {
        type:Number,
        required: false,
    },
    start:{
        type: Date,
        required: false,
    },
    end: {
        type: Date,
        required: false
    }, 
    total: {
        type: Number,
        required: true
    },
   // userId: {
        // type: String,
     //   required: true
    //}   
})

module.exports = mongoose.model("Pill", PillSchema)