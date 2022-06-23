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
       
        type:String,
        required : true,
        unique : true,
        trim: true,
        // validate:{
        // validator: validator.isEmail,
        // message: '{VALUE} is not a valid email',
        // }

    },
    password: {
        required: true,
        type: String
    }
    
},{ timestamps: true })

module.exports = mongoose.model('author', authorSchema)

