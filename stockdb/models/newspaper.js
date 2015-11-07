var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var NewspaperSchema = new Schema({
    company: String,
    newspaper: String,
    best_impact: Number,
    worst_impact: Number,
    max_impact: Number
});

var Newspaper = mongoose.model('Newspaper', NewspaperSchema);

module.exports = mongoose.model('Newspaper', NewspaperSchema);
