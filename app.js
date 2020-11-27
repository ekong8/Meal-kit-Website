// Name: Eunbi Kong
// Student Number: 158281188
// Section: NAA

const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const fileUpload = require("express-fileupload")
const methodOverride = require("method-override")
const helpers = require("handlebars-helpers")()

//set up dotenv
const dotenv = require("dotenv")
dotenv.config({ path: "./config/.env" })

const app = express()

app.use(express.static("public"))
//set up body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  methodOverride("_method", {
    mmethods: ["GET", "POST"],
  })
)
app.use(fileUpload())

//set up handlebars
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers,
  })
)

app.set("view engine", ".hbs")

//set up session
app.use(
  session({
    secret: process.env.SECRET_KEY,
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
const generalRoute = require("./controllers/general")
const userRoute = require("./controllers/user")
const mealRoute = require("./controllers/mealkit")

app.use("/", generalRoute)
app.use("/user", userRoute)
app.use("/mealkit", mealRoute)

//set up PORT
const HTTP_PORT = process.env.PORT
app.listen(HTTP_PORT, function () {
  console.log("Server has started on port " + HTTP_PORT)
})
