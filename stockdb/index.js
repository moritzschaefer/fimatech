/**
 * @author Long Hoang <long@mindworker.de>
 * http://www.barchartondemand.com/api/getHistory
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var baseURL = 'marketdata.websol.barchart.com';
var basePath = '/getHistory.json?key=5e0a5a18efcafd37d8495839faed111b&';

var http = require('http');
var moment = require('moment');
var regression = require('regression');

function getHisto(sym, unix, days, callback) {
    var u = parseInt(unix);
    var startDate = moment.unix(u-40*60*60).format("YYYYMMDD"); // equrivalent to one day before given date

    // @note: having it a day before doesn't seem to work...

    console.log(startDate);

    http.get({
	host: baseURL,
	path: basePath + "symbol="+sym+"&type=minutes&startDate="+startDate+"&interval=30"
    }, function(response) {
	// Continuously update stream with data
	var body = '';
	response.on('data', function(d) {
            body += d;
	});
	response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
	    
	    if (parsed.status.code != 200) {
		throw new Error("GetHisto for " + sym + "  " + date + " failed!");
	    }

	    // @note: this is inefficient, but company's api is 
	    if (days == 0 || days*13 > parsed.results.length) {
		callback(parsed.results);
	    }
	    else {
		callback(parsed.results.slice(0, days*13)); // each day has 13 datasets (TBC)
	    }
	});
    });
}

// For Analysis
var router = express.Router();
router.get('/genStockData/:sym/:date', function(req, res) {    
    // convert Unixtimestamp to the api's format
    var unix = req.params.date;

    // for debugging
    if (unix == "now") {
	unix = Math.floor(Date.now() / 1000); // Get current timestamp
    }
    
    getHisto(req.params.sym, unix, 2, function(d) {
	
	// Use linear regression in order to determine trend
	var datapairs = [];
	d.forEach(function(datapoint) {
	    datapairs.push([
		datapoint.open,
		(new Date(datapoint.timestamp)).getTime()
	    ]);
	});

	var regRes = regression('linear', datapairs);

	res.json({
	    slope: regRes.equation[0], 
	    intercept: regRes.equation[1],
	    detail: regRes
	});
    });
});

// FOR UI
router.get('/gethisto/:sym/:date', function(req, res) {
    
    // convert Unixtimestamp to the api's format
    var unix = req.params.date;
    
    getHisto(req.params.sym, unix, 0, function(d) {
	res.json({error: "", results: d});
    });
});



app.use('/api/', router);
app.listen(port);
