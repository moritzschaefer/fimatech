'use strict';

angular.module('core').controller('ModalViewController', ['$scope', 'ModalService',
  function($scope, ModalService) {
    $scope.closeable = ModalService.modalCloseable;
    $scope.size = ModalService.modalSize;
    $scope.params = ModalService.modalParams;

    $scope.$on('changedModal', function() {
      $scope.closeable = ModalService.modalCloseable;
      $scope.size = ModalService.modalSize;
      $scope.params = ModalService.modalParams;
    });

    $scope.hideModal = function() {
      ModalService.hideModal();
    };

    $scope.changeModal = function(template, size, closeable, params) {
      ModalService.showModal(template, size, closeable, params);
    };
  }
]);
