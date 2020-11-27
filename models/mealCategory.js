const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
  },
})

const model = mongoose.model("mealCategory", schema)
module.exports = model
