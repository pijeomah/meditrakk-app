const mongoose = require('mongoose')

const PillSchema = new mongoose.Schema({
    pillName:{
        type: String,
        required: true,
    },

    pillDosage:{
        type: String,
        required: true,
    },

    pillFrequency:{
        type: String,
        required: true,
    },

    takenAt: {
        type: Date,
        default: Date.now,
    },
    
})

module.exports = mongoose.model("Pill", PillSchema)