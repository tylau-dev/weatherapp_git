var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});

var userAccount = mongoose.model('users', userSchema);

module.exports = { userAccount }