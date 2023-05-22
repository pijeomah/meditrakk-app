const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/pills')
    }
    res.render('login', {
      title: 'Login'
    })
  }
  
  exports.postLogin = (req, res, next) => {
    const validationErrors = [];
  
    if (!validator.isEmail(req.body.email)) {
      validationErrors.push({ msg: 'Please enter a valid email address.' });
    }
    if (validator.isEmpty(req.body.password)) {
      validationErrors.push({ msg: 'Password cannot be blank.' });
    }
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('/login');
    }
  
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          reject(err);
        } else if (!user) {
          req.flash('errors', info);
          reject(new Error('Authentication failed.'));
        } else {
          req.logIn(user, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          });
        }
      })(req, res, next);
    })
      .then((user) => {
        req.flash('success', { msg: 'Success! You are logged in.' });
        res.redirect(req.session.returnTo || '/pills');
      })
      .catch((err) => {
        req.flash('errors', { msg: err.message });
        res.redirect('/login');
      });
  };
  
  
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
  
  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/pills')
    }
    res.render('signup', {
      title: 'Create Account'
    })
  }
  
  exports.postSignup = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('../signup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
  
    User.findOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
    .then(existingUser => {
      if (existingUser) {
        throw new Error('Account with that email address or username already exists.');
      }
      return user.save();
    })
    .then(() => req.logIn(user))
    .then(() => res.redirect('/pills'))
    .catch(err => {
      req.flash('errors', { msg: err.message });
      res.redirect('../signup');
    });
  
  }