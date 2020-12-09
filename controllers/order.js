const express = require("express")
const router = express.Router()
const { isLoggedIn, isAdmin } = require("../middleware/user")
const mealkitModel = require("../models/meal")
const cartModel = require("../models/cart")
const orderModel = require("../models/order")
const sgMail = require("@sendgrid/mail")
const _ = require("lodash")
const viewEngine = require("../renderer")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get("/details/:id", (req, res) => {
  const errors = []
  mealkitModel
    .findOne({ _id: req.params.id })
    .then((meal) => {
      res.render("mealkit/details", {
        title: "mealkits",
        pic: meal.pic,
        name: meal.name,
        price: meal.price,
        desc: meal.desc,
        cookingTime: meal.cookingTime,
        servings: meal.servings,
        calories: meal.calories,
        _id: req.params.id,
        errors,
      })
    })
    .catch((err) =>
      console.log(`Error happened when finding product in the database :${err}`)
    )
})

router.get("/cart", isLoggedIn, async (req, res) => {
  let userCart = await cartModel
    .findOne({ userId: req.session.user._id })
    .populate("meals.meal")
    .exec()
  if (!userCart) {
    userCart = await cartModel.create({ userId: req.session.user._id })
  }

  try {
    const totalPrice = userCart.meals.reduce(
      (prev, m) => prev + m.meal.price * m.quantity,
      0
    )

    res.render("mealkit/cart", {
      ...userCart.toObject(),
      totalPrice: Math.round((totalPrice + Number.EPSILON) * 100) / 100,
    })
  } catch (err) {
    res.render("general/error", {
      title: "Failed to Add to Cart",
      message: `Can not go to cart${err}`,
    })
  }
})

router.put("/cart", isLoggedIn, async (req, res) => {
  const { mealId, quantity } = req.body

  if (!mealId || !(await mealkitModel.findById(mealId))) {
    res.render("general/error", {
      title: "Failed to Add to Cart",
      message: "No such meal was found.",
    })
    return
  }

  const parsedQuantity = parseInt(quantity)
  if (isNaN(parsedQuantity)) {
    res.render("general/error", {
      title: "Failed to Add to Cart",
      message: "Quantity is required.",
    })
    return
  }

  let userCart = await cartModel
    .findOne({ userId: req.session.user._id })
    .populate("meals.meal")
    .exec()
  if (!userCart) {
    userCart = await cartModel.create({ userId: req.session.user._id })
  }
  try {
    let newMeals = [...userCart.meals]
    const existingMealIdx = userCart.meals.findIndex(
      (m) => m.meal._id == mealId
    )
    if (existingMealIdx !== -1) {
      newMeals[existingMealIdx].quantity += parsedQuantity
    } else {
      newMeals = [...newMeals, { meal: mealId, quantity: parsedQuantity }]
    }

    await userCart.updateOne({
      meals: newMeals,
    })

    res.redirect("/order/cart")
  } catch (err) {
    res.render("general/error", {
      title: "Failed to Add to Cart",
      message: `An error occured while adding meal to cart. (${err})`,
    })
  }
})

router.post("/cart/checkout", isLoggedIn, async (req, res) => {
  let userCart = await cartModel
    .findOne({ userId: req.session.user._id })
    .populate("meals.meal")
  if (!userCart) {
    userCart = await cartModel.create({ userId: req.session.user._id })
  }
  try {
    const order = await orderModel.create({
      userId: userCart.userId,
      details: userCart.meals.map((m) => ({
        meal: m.meal._id,
        quantity: m.quantity,
      })),
      totalPrice: userCart.meals.reduce(
        (prev, m) => prev + m.meal.price * m.quantity,
        0
      ),
    })

    await userCart.updateOne({
      meals: [],
    })

    const newOrder = await orderModel
      .findById(order._id)
      .populate("details.meal")
    const { username, firstName, lastName } = req.session.user
    const formattedOrder = {
      ...newOrder.toObject(),
      totalPrice:
        Math.round((newOrder.totalPrice + Number.EPSILON) * 100) / 100,
      createdAt: newOrder.createdAt.toLocaleString(),
    }

    const msg = {
      to: username,
      from: "ekong8@myseneca.ca",
      subject: "K-Food Order Receipt",
      html: await viewEngine.render(
        __dirname + "/../views/templates/orderReceipt.hbs",
        {
          username,
          firstName,
          lastName,
          ...formattedOrder,
        }
      ),
    }
    await sgMail.send(msg)

    res.render("mealkit/confirm")
  } catch (err) {
    res.render("general/error", {
      title: "Failed to Checkout Cart",
      message: `An error occured while processing your cart. (${err})`,
    })
  }
})

//delete cart
router.delete("/cart/meal/:id", isLoggedIn, async (req, res) => {
  let userCart = await cartModel.findOne({ userId: req.session.user._id })
  if (!userCart) {
    userCart = await cartModel.create({ userId: req.session.user._id })
  }

  try {
    const updatedMeals = userCart.meals.filter((m) => m.meal != req.params.id)

    await userCart.updateOne({
      meals: updatedMeals,
    })

    res.redirect("/order/cart")
  } catch (err) {
    res.render("general/error", {
      title: "Failed to Remove from Cart",
      message: `An error occured while removing meal from cart. (${err})`,
    })
  }
})

module.exports = router
