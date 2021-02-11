var express = require('express');
var router = express.Router();
var request = require("sync-request")
var cityModels = require("../models/cities");
var userModels = require("../models/users");

router.post('/sign-up', async function(req, res, next) {
    var checkUser = await userModels.userAccount.find({ email: req.body.email })

    console.log(checkUser.length)
    if (checkUser.length < 1) {
        var newUser = await new userModels.userAccount({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        var user = await newUser.save()

        req.session.activeUser = { username: newUser.username, id: newUser._id };

        console.log(req.session.activeUser)
        res.redirect('/weather')
    } else {
        var creationError = "User/Email already exists"
        var connectionError = ""
        res.render('login', { connectionError: connectionError, creationError: creationError })
    }
})

router.post('/sign-in', async function(req, res, next) {
    var checkUser = await userModels.userAccount.find({ email: req.body.email, password: req.body.password })

    if (checkUser.length === 1) {
        req.session.activeUser = { username: checkUser.username, id: checkUser._id }
        res.redirect('/weather')
    } else {
        var creationError = ""
        var connectionError = "Error Invalid Login"
        res.render('login', { connectionError: connectionError, creationError: creationError })
    }
})

router.get('/logout', async function(req, res, next) {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router;