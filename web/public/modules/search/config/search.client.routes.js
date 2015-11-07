'use strict';

// Setting up route
angular.module('search').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Users state routing
    $stateProvider.
      // -------------- Search Core ---------------//
    state('search', {
      url: '/search',
      templateUrl: 'modules/search/views/search.private.client.view.html'
    });
  }
]);

angular.module('search').run(['$rootScope', '$state', 'Authentication',
  function($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (Authentication.user) {

      }
    });
  }
]);
