const mongoose = require("mongoose");
const plm = require('passport-local-mongoose')

const userModel = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    dp: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    }
})

userModel.plugin(plm);

module.exports = mongoose.model('User',userModel);