'use strict';

angular.module('dashboard').controller('DashboardController', ['$scope', '$http', '$cookieStore', '$stateParams', '$location', 'Authentication',
  function($scope, $http, $cookieStore, $stateParams, $location, Authentication) {
    // If user is not signed in then redirect back home
    $scope.authentication = Authentication;
    if (!$scope.authentication.user) $location.path('/');



    $scope.receiveUsers = function() {

    };
  }
]);
