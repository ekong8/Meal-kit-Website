const express = require("express")
const router = express.Router()

//registeration
router.get("/", (req, res) => {
  res.render("account/registration", {})
})

router.post("/", (req, res) => {
  const { firstName, lastName, username, password, passwordConfirm } = req.body
  const errors = {
    fName: [],
    lName: [],
    username: [],
    password: [],
    passwordConfirm: [],
  }

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
      errors.password.push("Password should be 6-12 charcters long.")
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

  if (Object.values(errors).every((arr) => arr.length == 0)) {
    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: `${username}`,
      from: "ekong8@myseneca.ca",
      subject: "Welcome to K-Food!",
      html: `<strong>Hello, ${firstName} ${lastName}: </strong><br>
      <p>You have been registered to K-Food! Your username is ${username}. Thank you!</p>`,
    }
    sgMail
      .send(msg)
      .then(() => {
        res.render("general/welcome", {})
      })
      .catch((errors) => {
        console.log(`Error: ${errors}`)
      })
  } else {
    res.render("account/registration", {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      passwordConfirm: passwordConfirm,
      errors,
    })
  }
})

module.exports = router
