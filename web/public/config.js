'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'fimatec';
	var applicationModuleVendorDependencies = ['chart.js', 'ngResource', 'ngCookies',  'ngAnimate',  'ngTouch', 'ngSanitize', 'ngRetina', 'ui.router', 'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'mgcrea.ngStrap.typeahead'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
