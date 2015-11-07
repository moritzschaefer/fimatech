/* global process */
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 *	Set the environment.
 */
var receiveEnvironment = function() {
	var environment = process.argv[2];
	if (environment !== undefined) {
		return environment
	} else {
		return 'development';		
	}	
}

/**
 * Load app configurations
 */
module.exports = _.extend(
  require('./env/all.js'),
  require('./env/' +  receiveEnvironment() + '.js')
);

/**
 * Get the modules JavaScript files.
 */
module.exports.getJavaScriptAssets = function() {
	return this.assets.lib.js;
};

/**
 * Get the modules CSS files.
 */
module.exports.getCSSAssets = function() {
	return this.assets.lib.css;
};
