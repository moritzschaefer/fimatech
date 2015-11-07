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
    state('dashboard.administration.users', {
      url: '/users',
      templateUrl: 'modules/dashboard/views/administration/dashboard.users.client.view.html'
    }).
    state('dashboard.administration.transactions', {
      url: '/transactions',
      templateUrl: 'modules/dashboard/views/administration/dashboard.transactions.client.view.html'
    });
  }
]);

angular.module('dashboard').run(['$rootScope', '$state', 'Authentication',
  function($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (Authentication.user) {
        if (toState.name === 'dashboard.administration') {
          event.preventDefault();
          $state.go('dashboard.administration.users');
        }
      }
    });
  }
]);
