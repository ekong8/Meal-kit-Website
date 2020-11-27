const express = require("express")
const router = express.Router()
const mealModel = require("../models/meal")
const mealCategoryModel = require("../models/mealCategory")
const _ = require("lodash")

router.get("/", async (req, res) => {
  const meals = await mealModel.find({})
  const allMeals = []

  for (let m of meals.filter((m) => m.topmenu)) {
    const foundCategory = await mealCategoryModel.findOne({
      name: m.category,
    })

    const formatted = {
      _id: m._id,
      name: m.name,
      included: m.included,
      desc: m.desc,
      category: foundCategory ? foundCategory : null,
      price: m.price,
      cookingTime: m.cookingTime,
      servings: m.servings,
      calories: m.calories,
      topmenu: m.topmenu,
      pic: m.pic,
    }

    allMeals.push(formatted)
  }

  res.render("general/home", {
    meals: allMeals,
  })
})

router.get("/menu", async (req, res) => {
  const meals = await mealModel.find({})
  const allMeals = []

  for (let m of meals) {
    const foundCategory = await mealCategoryModel.findOne({
      name: m.category,
    })

    const formatted = {
      _id: m._id,
      name: m.name,
      included: m.included,
      desc: m.desc,
      category: foundCategory ? foundCategory : null,
      price: m.price,
      cookingTime: m.cookingTime,
      servings: m.servings,
      calories: m.calories,
      topmenu: m.topmenu,
      pic: m.pic,
    }

    allMeals.push(formatted)
  }

  res.render("general/menu", {
    meals: _.groupBy(allMeals, (m) => m.category.displayName),
  })
})

module.exports = router
