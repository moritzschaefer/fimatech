'use strict';

//Setting up route
angular.module('dashboard').config(['$stateProvider',
  function($stateProvider) {
    // transactions state routing
    $stateProvider.
      // -------------- Employees ---------------//
    state('dashboard', {
      url: '/dashboard',
      templateUrl: 'modules/dashboard/views/dashboard.private.client.view.html'
    }).
    state('dashboard.administration', {
      url: '/administration',
      templateUrl: 'modules/dashboard/views/administration/dashboard.administration.client.view.html'
    }).
    state('dashboard.administration.savedsearches', {
      url: '/savedsearches',
      templateUrl: 'modules/dashboard/views/administration/saved_searches.client.view.html'
    }).
    state('dashboard.administration.recentsearches', {
      url: '/recentsearches',
      templateUrl: 'modules/dashboard/views/administration/recent_searches.client.view.html'
    });
  }
]);

angular.module('dashboard').run(['$rootScope', '$state', 'Authentication',
  function($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (Authentication.user) {
        if (toState.name === 'dashboard.administration') {
          event.preventDefault();
          $state.go('dashboard.administration.savedsearches');
        }
      }
    });
  }
]);
