const mongoose = require('mongoose')
const DoseSchema = new mongoose.Schema({
    pill:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pill',
        required: true
    }, 
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledDate:{
        type: Date,
        required: true,
    }, 
    status:{
        type: String,
        enum: ['taken', 'pending', 'missed'],
        required: true
    },
    takenAt:{
        type: Date
    }

}, {timestamps: true})

module.exports = mongoose.model('Doses', DoseSchema)