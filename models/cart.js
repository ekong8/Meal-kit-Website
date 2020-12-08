const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  meals: {
    type: [
      {
        meal: { type: mongoose.Schema.Types.ObjectId, ref: "mealPackage" },
        quantity: Number,
      },
    ],
    default: [],
  },
})

const cartModel = mongoose.model("Cart", cartSchema)
module.exports = cartModel
