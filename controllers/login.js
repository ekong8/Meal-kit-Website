const express = require("express")
const router = express.Router()

//login
router.get("/", (req, res) => {
  res.render("account/login", {})
})

router.post("/", (req, res) => {
  const { username, password } = req.body
  const errorID = []
  const errorPwd = []
  if (username == "") {
    errorID.push("You must enter an user name.")
  }
  if (password == "") {
    errorPwd.push("You must enter a password.")
  }

  if (errorID.length > 0 || errorPwd.length > 0) {
    res.render("account/login", {
      errID: errorID,
      errPwd: errorPwd,
      username: username,
      password: password,
    })
  } else {
    res.redirect("/")
  }
})

module.exports = router
