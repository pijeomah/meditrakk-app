const passport = require('passport')
// imports the passport library into the page for authentication 
const validator = require('validator')
// imporrts the validator library into the page for string sanitization and validation
const User = require('../models/User')
// imports the user model to intercact with the users collection in MangoDB
 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('pills/dashboard')
      // if the req.user is true(user is logged in) then the user is redirected to the pills page
    }
    res.render('login', {
      title: 'Login'
      // renders the login page
    })
  }
  
  exports.postLogin = (req, res, next) => {
    // exporting the controller for handling post requests to the login page
    // three arguments for requests, responses and next  for handing off the  
    const validationErrors = [];
  // initializing an empty arry to hold all validation errors
    if (!validator.isEmail(req.body.email)) {
      validationErrors.push({ msg: 'Please enter a valid email address.' });
      // checking if the email is in a valid email format
      // if the format is invalid a message is pushed into the validation error array
    }
    if (validator.isEmpty(req.body.password)) {
      validationErrors.push({ msg: 'Password cannot be blank.' });
      // checking if the email field is blank
      // if blank an erro message is pushed into the validation errors array
    }
    
    if (validationErrors.length) {
    // if there are an validation errors send them in a flash message to the UI
      req.flash('errors', validationErrors);
      return res.redirect('/login');
      // reddirect to the login page
    }
  
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
    // normalize the email to a consistent format
    // in this case  we try to ensure dots present in emails remain where they are to ensure no duplicate arise
  
   
      // returns a promise to ensure that the asynchronous authentication process is handles more cleanly 
      passport.authenticate('local', (err, user, info) => {
        // passport authentication using the local strategy(just email and password)
        // callback accepts three arguments success, failure and internal errors
        if (err) return next(err)
          // if an internal server or passport error occurs the promise is rejected 
        
        if(!user) {
          req.flash('errors', info);
         return res.redirect('/login')
          //  if authentication fails flash the error message and reject the promise
        }
          req.logIn(user, (err) => {
            if (err) return next(err)
            req.flash('success', {msg: 'Success! You are logged in.'})
            res.redirect(req.session.returnTo || 'pills/dashboard')
            });
  })(req, res, next);
};
  
  
  exports.logout = (req, res) => {
    // exports the logout function to serve as a controller in the router 
    req.logout(() => {
  // call the passport logout method to log out the user 
      console.log('User has logged out.')
      // log a message to the console that the user has logged out
    })
    req.session.destroy((err) => {
      // call the passport destroy method to destroy the session
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
        // if there is an error during the destruction of the session than a message is logged to the console 
      req.user = null
      // clear the rreq.user to remove user data from the request
      res.redirect('/')
      // redirect to the index page
    })
  }
  
  exports.getSignup = (req, res) => {
    // export the getsignUp function and to handle GET request request for the sign up page 
    if (req.user) {
      return res.redirect('pills/dashboard')
      // if user is already signed up redirect the =m to the pills page
    }
    res.render('signup', {
      title: 'Create Account'
    })
    // if the user is not signed up render the sign up page 
  }
  
  exports.postSignup = (req, res, next) => {
  // export the postSignup function to handle POST request from the signup page 
    const validationErrors = [];
    // intitialize an empty array to store validation errors 
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    // conditional for checking if the format of the email is invalid, if invalid an error is pushed to the validation errors array
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
    // condoitional for checking that the length of the password is at least 8 characters long and if not pushing an error message to the validation error arra
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });
    // if the pasword enterd first does not match the confirm password field a messsage is pushed to the array that the passwords do not match
    if (validationErrors.length) {
      // if there are any validation errors flash them to the UI
      req.flash('errors', validationErrors);
      return res.redirect('../signup');
      // redirect to the signup page 
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  // here the vaidator normalizes the users email by ensuring that dots are not removed, this way emails are not duplicated and retain unique identities
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    });
    // initializing a new user object that contains the user's userName, email, and password obtained from the request body
  
    User.findOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
    // when the user attempts to login the db is checked to ensure that there is no existing email or username that matches the the one beign used sign up inorder to prevent duplicate accounts
      .then(existingUser => {
        if (existingUser) {
          throw new Error('Account with that email address or username already exists.');
          // if the username already exists then an error is thrown with the message that the email or username exists already 
        }
        return user.save();
        // if there is no matching username then the new user is saved to the db 
      })
      .then((savedUser) => {
        if(savedUser){
        req.login(savedUser, (err) => {
          if (err) return next(err);
          // after saving the user the passport login method is used to login to the app and the user is redirected to the pills dashboard
          req.flash('Success', {msg: "Account created successfully"})
          res.redirect('pills/dashboard');
        });
      }
      })
      .catch(err => {
        // in this catch bloc if there are any errors then an error message is flashed and the user is redirected to the login page 
        console.error('Signup error', err)
        req.flash('errors', { msg: 'An error ocurred durin signup. Please try again'});
        res.redirect('../signup');
      });
  };
  
  // **** CREATE TEN ANKI QUESTIONS FROM THIS FILE  ****