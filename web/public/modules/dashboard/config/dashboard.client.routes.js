'use strict';

//Setting up route
angular.module('dashboard').config(['$stateProvider',
	function($stateProvider) {
		// Dashboard state routing
		$stateProvider.
				state('users.dashboard', {
						url: '/dashboard/:id',
						templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
				});
	}
]);
