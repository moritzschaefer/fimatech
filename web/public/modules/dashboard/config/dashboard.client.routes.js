'use strict';

//Setting up route
angular.module('dashboard').config(['$stateProvider',
	function($stateProvider) {
		// Dashboard state routing
		$stateProvider.
        state('users.dashboard', {
            url: '/dashboard',
            templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
        }).
        state('users.dashboard.home', {
            url: '/',
            templateUrl: 'modules/dashboard/views/dashboard.home.client.view.html'
        });
	}
]);