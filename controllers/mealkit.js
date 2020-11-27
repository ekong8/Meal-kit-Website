const express = require("express")
const { parse } = require("path")
const router = express.Router()
const path = require("path")
const { isLoggedIn, isAdmin } = require("../middleware/user")
const mealkitModel = require("../models/meal")
const mealCategoryModel = require("../models/mealCategory")
const fs = require("fs")

router.get("/create", isAdmin, isLoggedIn, async (req, res) => {
  const categories = await mealCategoryModel.find({})

  res.render("mealkit/create", {
    categories: categories.map((c) => ({
      _id: c._id,
      name: c.name,
      displayName: c.displayName,
    })),
  })
})

router.get("/edit/:id", isAdmin, isLoggedIn, async (req, res) => {
  try {
    const meal = await mealkitModel.findById(req.params.id)
    const {
      _id,
      name,
      included,
      desc,
      category,
      price,
      cookingTime,
      servings,
      calories,
      topmenu,
      pic,
    } = meal

    const categories = await mealCategoryModel.find({})
    const foundCategory = await mealCategoryModel.findOne({ name: category })
    res.render("mealkit/edit", {
      _id,
      name,
      included,
      desc,
      category: foundCategory ? foundCategory : null,
      price,
      cookingTime,
      servings,
      calories,
      topmenu,
      pic,
      categories: categories.map((c) => ({
        _id: c._id,
        name: c.name,
        displayName: c.displayName,
      })),
    })
  } catch (err) {
    res.render("general/error", {
      title: `Error: meal ${_id}`,
      message: `No matching meal with id ${_id} found.`,
    })
  }
})

router.post("/", isAdmin, isLoggedIn, async (req, res) => {
  const {
    name,
    included,
    desc,
    category,
    price,
    cookingTime,
    servings,
    calories,
    topmenu,
  } = req.body
  const err = {
    name: [],
    included: [],
    desc: [],
    category: [],
    price: [],
    cookingTime: [],
    servings: [],
    calories: [],
    topmenu: [],
    img: [],
    other: [],
  }

  if (!name || name.length === 0) {
    err.name.push("name is required.")
  }

  if (!included || included.length === 0) {
    err.included.push("What is in cluded is required.")
  }
  if (!desc || desc.length === 0) {
    err.desc.push("Description is requried.")
  }
  if (!category || category.length === 0) {
    err.category.push("You must select category.")
  }
  if (!price || price.length === 0) {
    err.price.push("Price is required.")
  }
  if (!cookingTime || cookingTime.length === 0) {
    err.cookingTime.push("Cooking Time is required.")
  }
  if (!servings || servings.length === 0) {
    err.servings.push("Servings is required.")
  }
  if (!calories || calories.length === 0) {
    err.calories.push("Calory is required.")
  }

  let parsedTopMenu
  if (!topmenu || topmenu.length === 0) {
    err.topmenu.push("You must select top meal whether or not.")
  } else {
    if (topmenu === "yes") {
      parsedTopMenu = true
    } else if (topmenu === "no") {
      parsedTopMenu = false
    } else {
      err.topmenu.push("Invalid top menu selected.")
    }
  }

  if (!req.files || !req.files.image) {
    err.img.push("Please upload image.")
  }

  const parsedPrice = parseFloat(price)
  if (isNaN(parsedPrice)) {
    err.price.push("price is not a number.")
  }

  const parsedTime = parseFloat(cookingTime)
  if (isNaN(parsedTime)) {
    err.cookingTime.push("Cooking time is not a number.")
  }

  const parsedServing = parseFloat(servings)
  if (isNaN(parsedServing)) {
    err.servings.push("Serving is not a number.")
  }

  const parsedCalory = parseFloat(calories)
  if (isNaN(parsedCalory)) {
    err.calories.push("Calories is not a number.")
  }

  const foundCategory = await mealCategoryModel.findOne({ name: category })
  if (!foundCategory) {
    err.category.push("Invalid category name.")
  }

  if (Object.values(err).every((arr) => arr.length == 0)) {
    const meal = new mealkitModel({
      name: name,
      included: included,
      desc: desc.trim(),
      category,
      price: parsedPrice,
      cookingTime: parsedTime,
      servings: parsedServing,
      calories: parsedCalory,
      topmenu: parsedTopMenu,
    })

    meal
      .save()
      .then((meal) => {
        req.files.image.name = `meal_image_${meal._id}${
          path.parse(req.files.image.name).ext
        }`

        req.files.image
          .mv(`public/uploads/${req.files.image.name}`)
          .then(() => {
            mealkitModel
              .updateOne(
                {
                  _id: meal._id,
                },
                {
                  pic: req.files.image.name,
                }
              )
              .then(() => {})
          })

        console.log("User has been saved to the database.")
      })
      .catch((err) => {
        console.log(`Error inserting the user in the database.  ${err}`)
      })

    res.redirect("/user/dashboard")
  } else {
    const categories = await mealCategoryModel.find({})

    res.render("mealkit/create", {
      name,
      included,
      desc,
      category: foundCategory ? foundCategory : null,
      price,
      cookingTime,
      servings,
      calories,
      topmenu,
      categories: categories.map((c) => ({
        _id: c._id,
        name: c.name,
        displayName: c.displayName,
      })),
      err,
    })
  }
})

router.post("/category", async (req, res) => {
  const { name, displayName } = req.body
  if (!name || name.length === 0) {
    res.status(400).send("Name is required.")
    return
  }

  const newCategory = new mealCategoryModel({
    name,
    displayName: displayName ? displayName : name,
  })
  try {
    await newCategory.save()
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send("Failed to add new meal category.")
  }
})

router.put("/:id", isAdmin, isLoggedIn, async (req, res) => {
  const { id } = req.params

  const meal = await mealkitModel.findById(id)
  if (!meal) {
    res.render("general/error", {
      title: `Error: meal ${id}`,
      message: `No matching meal with id ${id} found.`,
    })

    return
  }

  const {
    name,
    included,
    desc,
    category,
    price,
    cookingTime,
    servings,
    calories,
    topmenu,
  } = req.body
  const { pic } = meal
  const err = {
    name: [],
    included: [],
    desc: [],
    category: [],
    price: [],
    cookingTime: [],
    servings: [],
    calories: [],
    topmenu: [],
    img: [],
    other: [],
  }

  if (!name || name.length === 0) {
    err.name.push("name is required.")
  }

  if (!included || included.length === 0) {
    err.included.push("What is in cluded is required.")
  }
  if (!desc || desc.length === 0) {
    err.desc.push("Description is requried.")
  }
  if (!category || category.length === 0) {
    err.category.push("You must select category.")
  }
  if (!price || price.length === 0) {
    err.price.push("Price is required.")
  }
  if (!cookingTime || cookingTime.length === 0) {
    err.cookingTime.push("Cooking Time is required.")
  }
  if (!servings || servings.length === 0) {
    err.servings.push("Servings is required.")
  }
  if (!calories || calories.length === 0) {
    err.calories.push("Calory is required.")
  }

  let parsedTopMenu
  if (!topmenu || topmenu.length === 0) {
    err.topmenu.push("You must select top meal whether or not.")
  } else {
    if (topmenu === "yes") {
      parsedTopMenu = true
    } else if (topmenu === "no") {
      parsedTopMenu = false
    } else {
      err.topmenu.push("Invalid top menu selected.")
    }
  }

  if (!req.files || !req.files.image) {
    err.img.push("Please upload image.")
  }

  const parsedPrice = parseFloat(price)
  if (isNaN(parsedPrice)) {
    err.price.push("price is not a number.")
  }

  const parsedTime = parseFloat(cookingTime)
  if (isNaN(parsedTime)) {
    err.cookingTime.push("Cooking time is not a number.")
  }

  const parsedServing = parseFloat(servings)
  if (isNaN(parsedServing)) {
    err.servings.push("Serving is not a number.")
  }

  const parsedCalory = parseFloat(calories)
  if (isNaN(parsedCalory)) {
    err.calories.push("Calory is not a number.")
  }

  const foundCategory = await mealCategoryModel.findOne({ name: category })
  if (!foundCategory) {
    err.category.push("Invalid category name.")
  }

  if (Object.values(err).every((arr) => arr.length == 0)) {
    try {
      await mealkitModel.updateOne(
        { _id: meal._id },
        {
          name: name,
          included: included,
          desc: desc.trim(),
          category,
          price: parsedPrice,
          cookingTime: parsedTime,
          servings: parsedServing,
          calories: parsedCalory,
          topmenu: parsedTopMenu,
        }
      )

      if (meal.pic) {
        const imagePath = path.join(__dirname, "public", "uploads", meal.pic)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      }

      req.files.image.name = `meal_image_${meal._id}${
        path.parse(req.files.image.name).ext
      }`

      await req.files.image.mv(`public/uploads/${req.files.image.name}`)
      await mealkitModel.updateOne(
        {
          _id: meal._id,
        },
        {
          pic: req.files.image.name,
        }
      )
    } catch (err) {
      console.log(err)

      res.render("general/error", {
        title: "Update Failure",
        message: `Failed to update meal data of meal ${meal._id}. Please try again.`,
      })
      return
    }

    res.redirect("/user/dashboard")
    return
  }

  const categories = await mealCategoryModel.find({})
  res.render("mealkit/edit", {
    _id: meal._id,
    name,
    included,
    desc,
    category: foundCategory ? foundCategory : null,
    price,
    cookingTime,
    servings,
    calories,
    topmenu,
    categories: categories.map((c) => ({
      _id: c._id,
      name: c.name,
      displayName: c.displayName,
    })),
    err,
  })
})

router.delete("/:id", isAdmin, isLoggedIn, async (req, res) => {
  try {
    await mealkitModel.deleteOne({ _id: req.params.id })
    res.redirect("/user/dashboard")
  } catch (err) {
    res.render("general/error", {
      title: "Delete Failure",
      message: `Failed to delete meal ${meal._id}. Please try again.`,
    })
  }
})

router.delete("/category/:name", async (req, res) => {
  const { name } = req.params
  if (!name || name.length === 0) {
    res.status(400).send("Name is required.")
    return
  }

  try {
    await mealCategoryModel.deleteOne({ name })
    res.sendStatus(200)
  } catch (err) {
    res.status(500).send(`Failed to delete meal category ${name}.`)
  }
})

module.exports = router
