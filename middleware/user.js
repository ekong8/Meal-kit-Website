const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect("/user/login")
  }
}

const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/")
  } else {
    next()
  }
}

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isClerk) {
    next()
  } else {
    res.redirect("/")
  }
}

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
}
