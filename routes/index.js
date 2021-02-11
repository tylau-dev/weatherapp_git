var express = require('express');
var router = express.Router();
var request = require("sync-request")
var cityModels = require("../models/cities");
var userModels = require("../models/users");

function cityNameFormat(name) {
    var formatName = name.charAt(0).toUpperCase() + name.slice(1)
    return formatName
}

// var cityList = []
/* GET home page. */

router.get('/', async function(req, res, next) {
    var creationError = ""
    var connectionError = ""
    res.render('login', { connectionError: connectionError, creationError: creationError });
});


router.get('/weather', async function(req, res, next) {
    console.log(req.session.username)
    if (typeof req.session.activeUser === 'undefined') {
        res.redirect('/')
    } else {
        req.session.cityList = await cityModels.cityModel.find()
        var errorMessage = ""
        res.render('weather', { cityList: req.session.cityList, errorMessage: errorMessage })
    };
});


router.post('/add-city', async function(req, res) {

    try {
        var errorMessage = ""
        var formatCityName = cityNameFormat(req.body.newCityName)
        var cityCheck = await cityModels.cityModel.find({ cityName: formatCityName })
            //Utiliser filter pour améliorer le code
        if (cityCheck.length < 1) {
            var result = await request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${formatCityName}&units=metric&lang=fr&appid=44d9e4105dc1dc2bb0cc211fbfcad323`)
            var resultJSON = JSON.parse(result.getBody())
            var newUser = new cityModels.cityModel({
                cityName: formatCityName,
                status: resultJSON.weather[0].description,
                icon: `http://openweathermap.org/img/wn/${resultJSON.weather[0].icon}@2x.png`,
                max: resultJSON.main.temp_max + "°C",
                min: resultJSON.main.temp_min + "°C",
                lon: resultJSON.coord.lon,
                lat: resultJSON.coord.lat
            })
            console.log(newUser)
            var user = await newUser.save()
        }
    } catch (err) {
        var errorMessage = "Invalid City"
    }

    req.session.cityList = await cityModels.cityModel.find()
    res.render('weather', { cityList: req.session.cityList, errorMessage: errorMessage })
})

router.get('/delete-button', async function(req, res, next) {
    await cityModels.cityModel.deleteOne({
        cityName: req.query.name
    })
    req.session.cityList = await cityModels.cityModel.find()
    var errorMessage = ""
    res.render('weather', { cityList: req.session.cityList, errorMessage: errorMessage });
});


router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.get('/update-data', async function(req, res, next) {
    var errorMessage = ""

    for (i = 0; i < req.session.cityList.length; i++) {
        var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.session.cityList[i].cityName}&units=metric&lang=fr&appid=44d9e4105dc1dc2bb0cc211fbfcad323`)
        var resultJSON = JSON.parse(result.getBody())

        await cityModels.cityModel.updateOne({ cityName: req.session.cityList[i].cityName }, {
            status: resultJSON.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${resultJSON.weather[0].icon}@2x.png`,
            max: resultJSON.main.temp_max + "°C",
            min: resultJSON.main.temp_min + "°C"
        })
    }
    res.render('weather', { cityList: req.session.cityList, errorMessage: errorMessage })
})

module.exports = router;