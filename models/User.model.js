// User model here
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password : {
      type: String,
      required: true
    }
  })

let UserModel = mongoose.model('user', userSchema)

module.exports = UserModel
