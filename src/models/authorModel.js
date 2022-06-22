const mongoose = require('mongoose');
// const ObjectId = mongoose.Schema.Types.ObjectId
// const { ObjectId } = require('mongoose');

const authorSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    }
    
},{ timestamps: true })

module.exports = mongoose.model('author', authorSchema)

