const express = require("express")
const router = express.Router()
const userModel = require("../models/User")
const bcrypt = require("bcryptjs")
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/user")

// Registor
router.get("/registration", isLoggedOut, (req, res) => {
  res.render("user/registration", {
    title: "registration",
  })
})

router.post("/registration", isLoggedOut, (req, res) => {
  const { firstName, lastName, username, password, passwordConfirm } = req.body
  const errors = {
    fName: [],
    lName: [],
    username: [],
    password: [],
    passwordConfirm: [],
    other: [],
  }
  //validation
  function pwdValidate(str) {
    const pwdFormat = new RegExp(/^[0-9a-zA-Z]{6,12}$/)
    return pwdFormat.test(str)
  }

  if (firstName == "") {
    errors.fName.push("Please enter your first name")
  }

  if (lastName == "") {
    errors.lName.push("Please enter your last name.")
  }

  if (username == "") {
    errors.username.push("Please enter your user name.")
  }

  if (password == "") {
    errors.password.push("Please enter your password.")
  } else {
    if (password.length < 6 || password.length > 12) {
      errors.password.push("Password should be 6-12 characters long.")
    } else if (pwdValidate(password) == false) {
      errors.password.push("Password must have letters and numbers only")
    }
  }

  if (passwordConfirm == "") {
    errors.passwordConfirm.push("Please enter your confirm password.")
  }

  if (password != passwordConfirm) {
    errors.passwordConfirm.push("Password is not the same.")
  }
  //check for username
  userModel
    .findOne({ username: req.body.username })
    .then((user) => {
      if (user !== null) {
        errors.other.push("Duplicate username!")
        res.render("user/login", {
          username: username,
          password: password,
          errors,
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })

  if (Object.values(errors).every((arr) => arr.length == 0)) {
    const user = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
    })
    user
      .save()
      .then(() => {
        //send email
        const sgMail = require("@sendgrid/mail")
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: `${username}`,
          from: "ekong8@myseneca.ca",
          subject: "Welcome to K-Food!",
          html: `<!DOCTYPE html>
                <html>
                  <head>
                    <style>
                     body {
                            --primary: #0275d8;
                            --success: #5cb85c;
                            --info: #5bc0de;
                            --warning: #f0ad4e;
                            --danger: #d9534f;
                            --dark: #292b2c;
                            --light: #f7f7f7;
                          }

                      .mail-content{
                         border: 1.5px solid lightgray;
                         border-radius: 5px;
                      }
                      .mail-title {
                        font-family: Arial;
                        text-align: center;
                        color: var(--success);
                      }

                       .mail-head {
                        font-family: Arial;
                        font-size: 20px;
                        text-align: center;
                        color: darkgray;
                      }
                    
                      .mail-text{
                        color: lightgray;
                        font-family: Arial;
                        text-align: center;
                      }

                      .mail-btn {
                        display: block;
                        padding: 8px 12px;
                        background-color: var(--success);
                        border-radius: 4px;
                        color: var(--light);
                        text-decoration: none;
                        font-family: Arial;
                        font-size: 18px;
                        font-weight: bold;
                        margin: 10px auto;
                        max-width: fit-content;
                      }

                      .mail-btn:hover {
                        filter: brightness(0.8);
                      }
                      </style>
                      </head>
                      <body>
                      <h1 class="mail-title">
                      Thanks for Join with K-Food!
                      </h1>
                      <div class="mail-content">
                      <h3 class="mail-head">Hello, ${firstName} ${lastName} </h3><br>
                      <p class="mail-text">You have been registered to K-Food! Your username is ${username}. <br><br>Thank you!</p>
                      <a class="mail-btn" href="https://ekong8.herokuapp.com/">
                        Start Now
                      </a>
                       </div>
                      </body>
                      </html>`,
        }
        sgMail
          .send(msg)
          .then(() => {
            res.render("general/welcome")
          })
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  } else {
    res.render("user/registration", {
      firstName: firstName,
      lastName: lastName,
      username: username,
      errors,
    })
  }
})

//Login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("user/login", {
    title: "Login",
  })
})

router.post("/login", isLoggedOut, (req, res) => {
  const { username, password } = req.body
  const errors = {
    username: [],
    password: [],
    others: [],
  }
  //validation
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
        //matching email and password
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
                res.redirect("/user/dashboard")
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

//logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy()
  res.redirect("/user/login")
})

//dashboard
router.get("/dashboard", isLoggedIn, (req, res) => {
  if (req.session.user.isClerk) {
    res.redirect("/user/dashboard/admin")
  } else {
    res.redirect("/user/dashboard/user")
  }
})

router.get("/dashboard/admin", isLoggedIn, isAdmin, (req, res) => {
  res.render("user/dashAdmin", {
    title: "Dashboard",
  })
})

router.get("/dashboard/user", isLoggedIn, (req, res) => {
  res.render("user/dashUser", {
    title: "Dashboard",
  })
})

module.exports = router
