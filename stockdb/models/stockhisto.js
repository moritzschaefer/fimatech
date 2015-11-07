var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var StockHistoSchema = new Schema({
    symbol: String,
    timestamp: Number, 
    open: Number,
    source: String
});

var StockHisto = mongoose.model('StockHisto', StockHistoSchema);

module.exports = mongoose.model('StockHisto', StockHistoSchema);
