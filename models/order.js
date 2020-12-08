const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderDetailSchema = new Schema({
  meal: { type: mongoose.Schema.Types.ObjectId, ref: "mealPackage" },
  quantity: Number,
})

const schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    details: {
      type: [orderDetailSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  }
)

const model = mongoose.model("Order", schema)
module.exports = model
