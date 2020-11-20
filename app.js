// Name: Eunbi Kong
// Student Number: 158281188
// Section: NAA

const express = require("express")
const handlebar = require("express-handlebars")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
//set up dotenv
const dotenv = require("dotenv")
dotenv.config({ path: "./config/.env" })

const app = express()

app.use(express.static("public"))
//set up body parser
app.use(bodyparser.urlencoded({ extended: true }))
//set up handlebars
app.engine(".hbs", handlebar({ extname: ".hbs" }))
app.set("view engine", ".hbs")
//set up session
app.use(
  session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  })
)
app.use((req, res, next) => {
  res.locals.user = req.session.user
  next()
})

//Connect to the MongoDB
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to the MongoDB database.")
  })
  .catch((err) => {
    console.log(`There was a problem connecting to the DB ${err}`)
  })

//set up router
const generalController = require("./controllers/general")
const loginController = require("./controllers/login")
const registrationController = require("./controllers/registration")

app.use("/", generalController)
app.use("/login", loginController)
app.use("/registration", registrationController)

//set up PORT
const HTTP_PORT = process.env.PORT
app.listen(HTTP_PORT, function () {
  console.log("Server has started on port " + HTTP_PORT)
})
