'use strict';

angular.module('search').controller('SearchController', ['$scope','$http', '$location', '$cookieStore', 'Authentication', '$state',
  function($scope, $http, $location, $cookieStore, Authentication, $state) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');
    $scope.searchValue = "";
    $scope.searchResults = [];

    // TODO: REST Call to receive search results dynamically.
    $scope.search = function(query) {
      var resultList = ['Apple', 'IBM', 'Goldman Sachs', 'Volkswagen'];
      $scope.searchResults = resultList.filter(function(searchResult) {
        return searchResult.toLowerCase().indexOf(query.toLowerCase()) > -1
      });
    };

    $scope.companyMapper = {'Apple': 'AAPL', 'IBM': 'IBM', 'Goldman Sachs': 'GS', 'Volkswagen': 'VLKAY'}

    $scope.select = function(searchResult) {
	$scope.searchValue = searchResult;
        $state.go('users.company', {id: $scope.searchValue});
    };
  }
]);
