const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Define the user schema

const mealSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  included: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  createdData: {
    type: Date,
    default: Date.now(),
  },
  topmenu: {
    type: Boolean,
    default: false,
  },
  pic: {
    type: String,
  },
})

const mealkitModel = mongoose.model("mealPackage", mealSchema)
module.exports = mealkitModel
