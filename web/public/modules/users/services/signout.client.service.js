'use strict';

angular.module('users').factory('Signout', ['$http', '$cookieStore', 'PromiseFactory',
	function($http, $cookieStore, PromiseFactory) {
		return {
			perform: function() {
				var p = PromiseFactory.defer();

				$cookieStore.remove('user');
				$cookieStore.remove('access_token');

				p.resolve();
				return p.promise;
			}
		};
	}
]);
