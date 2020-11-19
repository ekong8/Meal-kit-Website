const admin = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.type == "Admin") {
      next()
    }
  } else {
    res.redirect("account/login")
  }
}

module.exports = admin
