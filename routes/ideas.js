const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Helper



// Load Idea model - idea is a model with *data schema?*
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index page
router.get('/', ensureAuthenticated, (req, res) => { // had to replace app with router
  Idea.find({user: req.user.id}) // this makes account seperate
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form (: = a parameter or placeholder)
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {
  // Server side validation
  let errors = [];
  if (!req.body.title) {
    errors.push({text: 'Please add a title.'});
  }
  if (!req.body.details) {
    errors.push({text: 'Please add some details.'});
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    // this Idea come from our model in // Load Model Idea above
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added.');
        res.redirect('/ideas');
      })
  }
});

// Edit Form Process
// so this is using mongoose to update dta in mongoDB - figure this out better
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new values
    idea.title = req.body.title,
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Video idea updated.');
        res.redirect('/ideas');
      })
  });
});

// Delete Ideas
router.delete('/:id', ensureAuthenticated, (req, res) => {
  // res.send('DELETE'); so whent he delete button is hit in the app this id heads down delte Route
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed.');
      res.redirect('/ideas');
    });
});

module.exports = router;
