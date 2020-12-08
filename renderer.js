const exphbs = require("express-handlebars")
const helpers = require("handlebars-helpers")()

const handlebars = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  helpers,
})

module.exports = handlebars
