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
