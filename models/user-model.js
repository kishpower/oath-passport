const { Schema, default: mongoose, } = require("mongoose");


const userSchema = new Schema({
    username: String,
    googleID: String,
    email: String
})

const User = mongoose.model("user", userSchema);

module.exports = User;