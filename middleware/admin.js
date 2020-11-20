const admin = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.isClerk == true) {
      next()
    }
  } else {
    res.redirect("user/login")
  }
}

module.exports = admin
