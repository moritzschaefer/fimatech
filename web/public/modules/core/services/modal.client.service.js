'use strict';

angular.module('core').factory('ModalService', ['$rootScope', '$modal',
 function ($rootScope, $modal) {

        var modalService = {};
        var templates = {
            'signup-email': 'modules/core/views/modals/signup-email.modal.client.view.html',
            'signup-success': 'modules/core/views/modals/signup-success.modal.client.view.html',
            'login': 'modules/core/views/modals/login.modal.client.view.html',
            'forgot-password': 'modules/core/views/modals/forgot-password.modal.client.view.html',
            'tan': 'modules/core/views/modals/tan.modal.client.view.html'
        };
        modalService.modalCloseable = true;
        modalService.modalSize = null;
        modalService.modalInstance = null;
        modalService.modalParams = null;
        modalService.isVisible = false;

        modalService.showModal = function (template, size, closeable, params) {
            if(modalService.modalInstance) {
                modalService.hideModal();
            }
            modalService.modalInstance = $modal.open({
              templateUrl: templates[template],
              size: size,
              resolve: {
              }
            });
            modalService.isVisible = true;
            modalService.modalCloseable = closeable;
            modalService.modalParams = params;
            modalService.modalSize = size;
            this.broadcastModal();
        };

        modalService.hideModal = function () {
            modalService.modalCloseable = false;
            modalService.modalSize = null;
            modalService.isVisible = false;
            modalService.modalInstance.close();
            modalService.modalInstance = null;
            modalService.modalParams = null;
            this.broadcastModal();
        };

        modalService.broadcastModal = function () {
            $rootScope.$broadcast('changedModal');
        };
        return modalService;
 }
]);
