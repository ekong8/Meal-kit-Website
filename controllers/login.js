const express = require("express")
const router = express.Router()
const userModel = require("../models/User")
const bcrypt = require("bcryptjs")

//login
router.get("/login", (req, res) => {
  res.render("user/login")
})

router.post("/login", (req, res) => {
  const { username, password } = req.body
  const errors = {
    username: [],
    password: [],
    others: [],
  }
  if (username == "") {
    errors.username.push("You must enter an user name.")
  }
  if (password == "") {
    errors.password.push("You must enter a password.")
  }
  if (Object.values(errors).every((arr) => arr.length == 0)) {
    userModel
      .findOne({
        username: req.body.username,
      })
      .then((user) => {
        if (user === null) {
          errors.others.push("Sorry your username or password was not correct!")
          res.render("user/login", {
            username: username,
            password: password,
            errors,
          })
        } else {
          bcrypt
            .compare(req.body.password, user.password)
            .then((matched) => {
              if (matched) {
                req.session.user = user
                res.redirect("/")
              } else {
                errors.others.push(
                  "Sorry your username or password was not correct!"
                )
                res.render("user/login", {
                  username: username,
                  password: password,
                  errors,
                })
              }
            })
            .catch((err) => console.log(err))
        }
      })
      .catch((err) => console.log(err))
  } else {
    res.render("user/login", {
      username: username,
      password: password,
      errors,
    })
  }
})
// Set up logout
router.get("/logout", (req, res) => {
  // Clear the session from memory.
  req.session.destroy()

  res.redirect("/user/login")
})
//Set up type
router.get("/dash", (req, res) => {
  if (req.session.user) {
    if (req.session.user.isClerk === true) {
      res.render("user/dashAdmin", {
        title: "Dashboard",
      })
    } else {
      res.render("user/dashUser", {
        title: "Dashboard",
      })
    }
  } else {
    res.redirect("/user/login")
  }
})

module.exports = router
