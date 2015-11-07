var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    publication_timestamp: Number,
    url: String,
    company: String,
    newspaper: String,
    title: String
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = mongoose.model('Article', ArticleSchema);
