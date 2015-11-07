'use strict';

angular.module('core').controller('NavigationController', ['$scope', '$rootScope', '$location', '$http', 'Authentication', 'Signout', 'ModalService', '$state',
  function($scope, $rootScope, $location, $http, Authentication, Signout, ModalService, $state) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;

    $scope.$state = $state;

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
      $scope.navbarFixed = $state.current.name.includes('transactionsPublic');
      if (ModalService.isVisible) {
        ModalService.hideModal();
      }
    });

    // Modal Panels.
    $scope.displayRegisterModal = function() {
      ModalService.showModal('signup-email', 'xs', true, '');
    };

    $scope.displayLoginModal = function() {
      ModalService.showModal('login', 'xs', true, '');
    };

    // Signup.
    $scope.credentials = {};
    $scope.signup = function(credentials) {
      alert(JSON.stringify(credentials));
    };

    // Signout.
    $scope.signout = function() {
      // Inform the server about the signout.
      Signout.perform().success(function(response) {

        // If successful the global user will be deleted.
        $scope.authentication.user = null;

        // Redirect to the index page.
        $location.path('/');
      }).error(function(response) {
        // TODO: Present error message to user.
        $scope.error = response.message;
      });
    };
  }
]);
