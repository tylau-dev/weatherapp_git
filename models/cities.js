var mongoose = require('mongoose');

var citySchema = mongoose.Schema({
    cityName: String,
    status: String,
    icon: String,
    max: String,
    min: String,
    lon: Number,
    lat: Number
})

var cityModel = mongoose.model('cities', citySchema);

module.exports = { cityModel }