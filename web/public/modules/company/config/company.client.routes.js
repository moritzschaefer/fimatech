'use strict';

//Setting up route
angular.module('company').config(['$stateProvider',
	function($stateProvider) {
		// Dashboard state routing
		$stateProvider.
				state('users.company', {
						url: '/dashboard/:id',
						templateUrl: 'modules/company/views/company.client.view.html'
				});
	}
]);
