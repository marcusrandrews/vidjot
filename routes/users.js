const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load user model
require('../models/Users');
const User = mongoose.model('users');

// User Login ROUTE
router.get('/login', (req, res) => { // Had to replace app with router
  res.render('users/login');
});

// User register ROUTE
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  }) (req, res, next);
});

// Resgister form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match.'});
  }

  if (req.body.password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters.'});
  }

  if (errors.length > 0) {
    res.render('users/register', { // we are passing the below in so the form does not clear
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already registered.')
          res.redirect('/users/register');
        } else {
          const newUser = new User ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then (user => {
                  req.flash('success_msg', 'You are now registered and can login in.')
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            }); // pass in plain text password object here
          });
        }
      });
  }
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Your are logged out.');
  res.redirect('/users/login');
});

module.exports = router;
