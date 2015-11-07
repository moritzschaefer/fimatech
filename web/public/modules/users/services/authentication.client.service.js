'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$cookieStore',
	function($cookieStore) {
		var _this = this;

		_this._data = {
			user: $cookieStore.get('user')
		};

		return _this._data;
	}
]);
