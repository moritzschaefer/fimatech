'use strict';

angular.module('users').factory('HttpRequestInterceptor', ['$cookieStore', function($cookieStore) {
  return {
    request: function($config) {
      if ($cookieStore.get('access_token')) {
        $config.headers['Authorization'] = 'Bearer ' + $cookieStore.get('access_token');
      }
      return $config;
    }
  };
}]).config(function($httpProvider) {
  $httpProvider.interceptors.push('HttpRequestInterceptor');
});
