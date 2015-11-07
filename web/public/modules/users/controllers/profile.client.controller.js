'use strict';

angular.module('users').controller('UsersProfilePrivateController', ['$scope', '$http', '$location', 'Users', 'Authentication',
 function ($scope, $http, $location, Users, Authentication) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.user = $scope.authentication.user;
        $scope.user.birthdayItems = {
            day: new Date($scope.user.birthday).getDate(),
            month: new Date($scope.user.birthday).getMonth(),
            year: new Date($scope.user.birthday).getFullYear()
        };
     
        // Range Helper
        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);
            return input;
        };

        // Update a user profile
        $scope.updateUserProfile = function (isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                $scope.user.birthday = new Date($scope.user.birthdayItems.year,$scope.user.birthdayItems.month,$scope.user.birthdayItems.day);
                
                var user = new Users($scope.user);
                user.$update(function (response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function (response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };
 }
]);