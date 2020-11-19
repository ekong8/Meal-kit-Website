const express = require("express")
const router = express.Router()
const userModel = require("../models/User")
const bcrypt = require("bcryptjs")

//login
router.get("/", (req, res) => {
  res.render("account/login", {})
})

router.post("/", async (req, res) => {
  const { username, password } = req.body
  const errors = {
    username: [],
    password: [],
    other: [],
  }
  if (username == "") {
    errors.username.push("You must enter an user name.")
  }
  if (password == "") {
    errors.password.push("You must enter a password.")
  }

  try {
    const foundUser = await userModel.findOne({ username: req.body.username })
    if (user == null) {
      errors.other.push("Sorry your username or password was not correct!")
    } else {
      const isMatched = await bcrypt.compare(
        req.body.password,
        foundUser.password
      )

      if (isMatched === true) {
        req.session.user = user
      } else {
        errors.other.push("Sorry your username or password was not correct!")
      }
    }

    if (Object.values(errors).every((arr) => arr.length == 0)) {
      ren.redirect("/")
    } else {
      res.render("account/login", {
        username: username,
        password: password,
        errors,
      })
    }
  } catch (err) {
    errors.other.push(err)
    res.render("account/login", {
      errors,
    })
  }
})

// Set up logout
router.get("/logout", (req, res) => {
  // Clear the session from memory.
  req.session.destroy()

  res.redirect("account/login")
})
//Set up type
router.get("/dash", (req, res) => {
  if (req.session.user) {
    if (req.session.user.type == "Admin") {
      res.render("account/dashAdmin", {
        title: "Dashboard",
      })
    } else {
      res.render("account/dashUser", {
        title: "Dashboard",
      })
    }
  } else {
    res.redirect("account/login")
  }
})

module.exports = router
