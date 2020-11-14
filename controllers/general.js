const express = require("express")
const router = express.Router()
const data = require("../models/data.js")

router.get("/", (req, res) => {
  res.render("general/home", {
    data: data.getAllData(),
  })
})

router.get("/menu", (req, res) => {
  res.render("general/menu", {
    data: data.getAllData(),
  })
})

module.exports = router
