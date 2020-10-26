const express = require("express")
const router = express.Router()
var data = require("../statics/data")

router.get("/", (req, res) => {
  res.render("general/home", {
    data: data.packages,
  })
})

router.get("/menu", (req, res) => {
  res.render("general/menu", {
    data: data.packages,
  })
})

module.exports = router
