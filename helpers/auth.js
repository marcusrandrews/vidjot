module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('Not Authorized');
    res.redirect('/user/login')
  }
 }
