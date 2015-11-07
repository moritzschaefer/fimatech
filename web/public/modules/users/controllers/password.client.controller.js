'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'ModalService',
  function($scope, $stateParams, $http, $location, Authentication, ModalService) {
		// Submit forgotten password account email.
		$scope.resetPassword = function() {
			// TODO: Reset Password route.
		};

		// Change user password
    $scope.changeUserPassword = function() {
      // TODO: Reset Password route.
    };

    $scope.showModalForgotPassword = function() {
      ModalService.showModal('forgot-password', false);
    };
  }
]);
