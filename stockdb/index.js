/**
 * @author Long Hoang <long@mindworker.de>
 * http://www.barchartondemand.com/api/getHistory
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var baseURL = 'marketdata.websol.barchart.com';
var basePath = '/getHistory.json?key=5e0a5a18efcafd37d8495839faed111b&';

var uriUtil = require('mongodb-uri');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var mongodbUri = process.env.MONGOLAB_URI || "mongodb://localhost/fimatech";
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

var YQL = require('yql');

var util = require('util')
var exec = require('child_process').exec;

console.log("Connect to " + mongodbUri);
mongoose.connect(mongooseUri);
conn = mongoose.connection;

conn.on('error', function(err) {
    console.log("Mongoose Connection Error: " + err);
    throw err;
});

conn.on('connected', function() {
    console.log("Successfully connected to Mongolab");
    // @todo start all the database stuff asynchronously
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With");
  next();
});


var StockHisto = require('./models/stockhisto')
var Newspaper = require('./models/newspaper')
var Article = require('./models/article')

var http = require('http');
var moment = require('moment');
var regression = require('regression');

function getHisto(sym, unix, days, callback) {
    var u = parseInt(unix);
    var startDate = moment.unix(u-40*60*60).format("YYYYMMDD"); // equrivalent to one day before given date

    // @note: having it a day before doesn't seem to work...

    http.get({
	host: baseURL,
	path: basePath + "symbol="+sym+"&type=minutes&startDate="+startDate+"&interval=30"
    }, function(response) {
	console.log(this.path);

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
		(new Date(datapoint.timestamp)).getTime(),
		datapoint.open
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

router.get('/feed/:sym/:date', function(req, res) {
    var unix = req.params.date;

    // for debugging
    if (unix == "now") {
	unix = Math.floor(Date.now() / 1000); // Get current timestamp
    }
    
    getHisto(req.params.sym, unix, 0, function(d) {
	d.forEach(function(datapoint) {
	    var stockentry = new StockHisto({
		symbol:    req.params.sym,
		timestamp: (new Date(datapoint.timestamp)).getTime() / 1000,
		open:      datapoint.open,
		source:    "Barchart"
	    });

	    stockentry.save(function(err, savedQuestion) {
		if (err) {
		    console.log(err);
  		    res.send(err);
  		    return
		}
  		console.log("[Barchart] Added Stock Entry with id " + stockentry._id);
	    });
	});
	console.log("Done!");
	res.json({error: ""});
    });

    var query = new YQL('select * from yahoo.finance.historicaldata where symbol = "'+req.params.sym+'" and startDate = "2015-01-01" and endDate = "2015-11-07"');
    query.exec(function (error, response) {
	var d = response.query.results.quote;

	d.forEach(function(datapoint) {
	    var stockentry = new StockHisto({
		symbol:    req.params.sym,
		timestamp: (new Date(datapoint.Date)).getTime() / 1000,
		open:      datapoint.Open,
		source:    "Yahoo"
	    });

	    stockentry.save(function(err, savedQuestion) {
		if (err) {
		    console.log(err);
  		    res.send(err);
  		    return
		}
  		console.log("[Yahoo] Added Stock Entry with id " + stockentry._id);
	    });
	});
    }); 
});


/// @deprecated by python code
router.get('/getinterval/:sym/:date/:days', function(req, res) {    
    // convert Unixtimestamp to the api's format
    var startDate = parseInt(req.params.date);
    var endDate = startDate + 24*60*60* req.params.days;

    StockHisto.find({symbol: req.params.sym, timestamp: {$gt: startDate, $lt: endDate}}, function(err, stocks){
        if (err) {
            console.log(err);
            res.send(err);
  	    return;
  	}
	
	// Use linear regression in order to determine trend
	var datapairs = [];
	stocks.forEach(function(datapoint) {
	    datapairs.push([
		datapoint.open,
		(new Date(datapoint.timestamp)).getTime()
	    ]);
	});

	var regRes = regression('linear', datapairs);

	res.json({
	    slope: regRes.equation[0], 
	    intercept: regRes.equation[1],
	    data: stocks
	});
    });
});

router.get('/gethisto/:sym', function(req, res) {        
    StockHisto.find({symbol: req.params.sym, timestamp: {$gt: 1443657600}}).sort({'timestamp': 1}).exec(function(err, stocks){
        if (err) {
            console.log(err);
            res.send(err);
  	    return;
  	}
	
        res.json(stocks);
    });
});

router.get('/newspaper/:company', function(req, res) {
    var result = {}

    // @note wowo such a call back hell
    function getBest() { 
	Newspaper.find({company: req.params.company}).sort({'best_impact': -1}).limit(5).exec(function(err, elements) {
	    if (err) {
		console.log(err);
		res.send(err);
  		return;
  	    }
	    
            result.best_impact = elements;
	    res.json(result);
	});
    }
    
    function getWorse() {
	Newspaper.find({company: req.params.company}).sort({'worst_impact': -1}).limit(5).exec(function(err, elements) {
	    if (err) {
		console.log(err);
		res.send(err);
  		return;
  	    }
	    
            result.worse_impact = elements;
	    getBest();
	});
    }

    Newspaper.find({company: req.params.company}).sort({'max_impact': -1}).limit(5).exec(function(err, elements) {
	if (err) {
            console.log(err);
            res.send(err);
  	    return;
  	}
	
        result.max_impact = elements;
	getWorse();
    });
});


router.get('/articles/:company/:newspaper', function(req, res) {
    Article.find({company: req.params.company, newspaper: req.params.newspaper}, function(err, elements) {	
	if (err) {
            console.log(err);
            res.send(err);
  	    return;
  	}
	
        res.json(elements);
    });
});

router.get('/show/article/:url', function(req, res) {
    exec('./../sentimentanalysis/main.py',function(err,stdout,stderr){
	util.puts(err);
	console.log(stdout);
	res.json(stdout);
    });
});

app.use('/api/', router);
app.listen(port);
