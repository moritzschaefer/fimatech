'use strict';

angular.module('search').controller('SearchController', ['$scope','$http', '$location', '$cookieStore', 'Authentication',
  function($scope, $http, $location, $cookieStore, Authentication) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');
    $scope.searchValue = "";
    $scope.searchResults = [];

    // TODO: REST Call to receive search results dynamically.
    $scope.search = function(query) {
      if ($scope.preventNextSearch) {
				return [];
			}

      var resultList = ['BMW', 'Volkswagen'];
      $scope.searchResults = resultList.filter(function(searchResult) {
        return searchResult.toLowerCase().indexOf(query.toLowerCase()) > -1
      });
    };

    $scope.select = function(searchResult) {
				$scope.searchValue = searchResult;
        alert(searchResult)
        // TODO: Change route here.
    };
  }
]);
