var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    display_name: {type: String, required: true},
    country: {type: String, required: true},
    id: {type: String, required: true},
    image: {type: String, required: true},

});