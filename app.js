// Name: Eunbi Kong
// Student Number: 158281188
// Section: NAA

const express = require("express")
const handlebar = require("express-handlebars")
const bodyparser = require("body-parser")
const dotenv = require("dotenv")
dotenv.config({ path: "./config/.env" })

const app = express()
const path = require("path")
const HTTP_PORT = process.env.PORT

app.use(express.static(path.join(__dirname, "statics")))
//set up body parser
app.use(bodyparser.urlencoded({ extended: false }))
//set up handlebars
app.engine(".hbs", handlebar({ extname: ".hbs" }))
app.set("view engine", ".hbs")

//set up router
const generalController = require("./controllers/general")
const loginController = require("./controllers/login")
const registrationController = require("./controllers/registration")

app.use("/", generalController)
app.use("/login", loginController)
app.use("/registration", registrationController)

app.listen(HTTP_PORT, function () {
  console.log("Server has started on port " + HTTP_PORT)
})
