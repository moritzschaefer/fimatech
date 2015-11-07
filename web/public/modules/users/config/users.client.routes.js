'use strict';

// Setting up route
angular.module('users').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Users state routing
    $stateProvider.
      // -------------- Users Core ---------------//
    state('users', {
      url: '/users',
      templateUrl: 'modules/users/views/users.private.client.view.html'
    }).
    state('users.home', {
        url: '/',
        templateUrl: 'modules/dashboard/views/dashboard.client.view.html'
      }).
      // -------------- Private Profile ---------------//
    state('users.profilePrivate', {
      url: '/contract',
      templateUrl: 'modules/users/views/profile/profile.private.client.view.html'
    }).
    state('users.profilePrivate.contract', {
        url: '/',
        templateUrl: 'modules/users/views/profile/profile.private.contract.client.view.html'
      }).
    state('users.profilePrivate.home', {
      url: '/home',
      templateUrl: 'modules/users/views/profile/profile.private.home.client.view.html'
    }).
    state('users.profilePrivate.media', {
      url: '/media',
      templateUrl: 'modules/users/views/profile/profile.private.media.client.view.html'
    }).
    state('users.profilePrivate.security', {
      url: '/security',
      templateUrl: 'modules/users/views/profile/profile.private.security.client.view.html'
    }).
    state('users.profilePrivate.notifications', {
      url: '/notifications',
      templateUrl: 'modules/users/views/profile/profile.private.notifications.client.view.html'
    }).
    state('users.profilePrivate.banking', {
      url: '/banking',
      templateUrl: 'modules/users/views/profile/profile.private.banking.client.view.html'
    }).
    state('users.profilePrivate.privacy', {
      url: '/privacy',
      templateUrl: 'modules/users/views/profile/profile.private.privacy.client.view.html'
    });
  }
]);

angular.module('users').run(['$rootScope', '$state', 'Authentication',
  function($rootScope, $state, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (Authentication.user) {
        if (toState.name === 'users') {
          event.preventDefault();
          $state.go('/');
        } else if (toState.name === 'users.profilePrivate') {
          event.preventDefault();
          $state.go('users.profilePrivate.home');
        }
      }
    });

  }
]);
