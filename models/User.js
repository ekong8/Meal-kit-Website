const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
//Define the user schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdData: {
    type: Date,
    default: Date.now(),
  },
  isClerk: {
    type: Boolean,
    default: false,
  },
})

userSchema.pre("save", function (next) {
  var user = this
  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(user.password, salt)
        .then((encryptedPwd) => {
          user.password = encryptedPwd
          next()
        })
        .catch((err) => {
          console.log(`Error occured when hashing. ${err}`)
        })
    })
    .catch((err) => {
      console.log(`Error occured when salting. ${err}`)
    })
})
const userModel = mongoose.model("Users", userSchema)
module.exports = userModel
