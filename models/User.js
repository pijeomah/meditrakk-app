const bcrypt = require('bcrypt')
// IMPORTING THE BCRYPT LIBRARY INTO THE USER MODEL FILE
const mongoose = require('mongoose')
// IMPORTING THE MONGOOSE LIBRARY TO PROVDE STRUCTURE TO OUR DATA ENTRY
const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
  //  intiializing the user schema usning mongoose to create the schema 
  // the user name field is s string type and has to be unique
  // the email field is s string type and has to be unique
  // the password is a string but does not have to be unique
})


// Password hash middleware.
 
 UserSchema.pre('save', function save(next) {
  // a pre-save hook that runs before a user is saved to the database
  const user = this
  // the user document is stored in a variable for easier access 
  if (!user.isModified('password')) { return next() }
  // if the user password is not modified hashing is skipped
  bcrypt.genSalt(10, (err, salt) => {
    // the salt is generated at 10 rounds - really high computational complexity
    if (err) { return next(err) }
    // if an error arises from salting the error is passed to mongoose
    bcrypt.hash(user.password, salt, (err, hash) => {
      // after thesalt is generated the password is hashed 
      if (err) { return next(err) }
      // if there is an error in the hashing process pass it to the next middleware
      user.password = hash
      // replace the user password with the hash
      next()
      // move on to the next middleware 
    })
  })
})


// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
  // define an instance called comparePassword on the user schema 
  // use bcrypt to compare the provided passwaord to what is in the database
};

module.exports = mongoose.model('User', UserSchema);


