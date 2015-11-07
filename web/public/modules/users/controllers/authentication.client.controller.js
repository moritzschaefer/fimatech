'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$cookieStore', '$http', '$location', '$timeout', 'Authentication', 'ModalService', 'PromiseFactory',
  function($scope, $cookieStore, $http, $location, $timeout, Authentication, ModalService, PromiseFactory) {
    $scope.authentication = Authentication;

    // If user is signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    $scope.signup = function(firstName, lastName, company, email, password) {
      var token = CryptoJS.SHA256(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(email + ':' + password)))

      var req = {
        method: 'POST',
        // TODO: Add correct Route here!
        url: 'http://localhost:8888/index.php/register',
        data: {
          firstname: firstName,
          lastname: lastName,
          company: company,
          email: email,
          token: token.toString()
        }
      }
      $http(req).then(function() {
        ModalService.showModal('signup-success', 'xs', true);
      }, function() {
        // TODO: Handle Error
        ModalService.showModal('signup-success', 'xs', true);
      });
    };

    $scope.signin = function(email, password) {
      var token = CryptoJS.SHA256(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(email + ':' + password)))
      $cookieStore.put('access_token', token.toString());

      var req = {
        method: 'GET',
        url: 'http://localhost:8888/index.php/authorize'
      }
      $http(req).then(function(response) {
        $scope.authentication.user = response.data;
        $cookieStore.put('user', $scope.authentication.user);
        $location.path('/search')

          // Hide all Modal Views.
        ModalService.hideModal();
      }, function() {
        // TODO: Remove code in stars and handle error.
        /***********************************/
        /***********************************/
        /***********************************/
        /***********************************/

        // TODO: Remove assignment below
        $scope.authentication.user = {
          "identifier": "5630a9afaa4742ac0702a421",
          "email": "robert.weindl@blackstack.net",
          "firstName": "Robert",
          "lastName": "Weindl",
          "company": "sinus.io",
          "displayName": "Robert Weindl",
          "picture": "https://pbs.twimg.com/profile_images/87069583/avatar_ghost.jpg",
          "isActive": true
        };

        $cookieStore.put('user', $scope.authentication.user);
        $location.path('/search')
        /***********************************/
        /***********************************/
        /***********************************/
        /***********************************/

        // Hide all Modal Views.
        ModalService.hideModal();
      });
    };

    $scope.displaySignupModal = function() {
      ModalService.showModal('signup', false);
    };

    $scope.displayLoginModal = function() {
      ModalService.showModal('login', false);
    };

    $scope.displaySignupMailModal = function() {
      ModalService.showModal('signup-email', false);
    };

    $scope.displayForgotPasswordModal = function() {
      ModalService.showModal('forgot-password', false);
    };
  }
]);
