const mongoose = require('mongoose')
// importing the mongoose library to give structure tom the documents in our database 

const PillSchema = new mongoose.Schema({
    // intializing the new PillSchema using the mongoose Schema property 
    name:{
        type: String,
        required: true,
    },
    // name field that is a string type field and is required

    dosage:{
        type: String,
        required: true,
    },
        // dosage field that is required and is a string type
    frequency:{
        type: Number,
        required: true,
    },
        // frequency refers to the number of times the drug is to be taken data type is number and it is required
    takenAt: {
        type: Date,
        default: Date.now,
    },
            // the takenAt refers to the day when the pill is taken
    ailment: {
        type: String,
        required: true
    },
    // ailment referst to the ailnent the medication is meant to handle. It has a string type and is required

    number: {
        type:Number,
        required: false,
        //  refers to the number of drugsto be taken at a time; has a number type and is not required 
        //  this may be a redundancy LOOK INTO IT!!!!
    },
    start:{
        type: Date,
        required: false,
        // START DATE OF TAKING THE PILLS NOT REQUIRED AND THE DATA TYPE IS DATE 
    },
    end: {
        type: Date,
        required: false
         // END DATE OF TAKING THE PILLS NOT REQUIRED AND THE DATA TYPE IS DATE 
    }, 
    total: {
        type: Number,
        required: true
        // TOTAL NUMBER OF PILLS TO BE TAKEN OVER THE DOSAGE PERIOD THIS IS REQUIRED AND IS A NUMBER
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        // USER FIELD HAS A TYPE OF OBJECTID USED TO IDENTIFY THE USER MAKING AN ENTRY INTO THE DATABASE, IT IS REQUIRED AND IT IS REFERENCED FROM THE USER MODEL
      }
})

module.exports = mongoose.model("Pill", PillSchema)
// EXPORTING THE PILL MODEL AND THE THE DB IS CALLED PILL