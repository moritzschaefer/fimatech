'use strict';

angular.module('core').controller('HomeController', ['$scope', 'ModalService',
  function($scope, ModalService) {
    $scope.displayRegisterModal = function() {
      ModalService.showModal('signup-email', 'xs', true, '');
    };
  }
]);
