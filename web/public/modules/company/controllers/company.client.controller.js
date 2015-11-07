'use strict';

angular.module('company').controller('CompanyController', ['$scope', '$http', '$location', '$cookieStore', 'Authentication', '$stateParams',
  function($scope, $http, $location, $cookieStore, Authentication, $stateParams) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    // Initialize the passed state parameter.
    $scope.id = $stateParams.id;
    $scope.company = $scope.id;

    // Initialize the company data.
    $scope.initCompanyData = function() {
      var companyMapper = {'Apple': 'AAPL', 'IBM': 'IBM', 'Goldman Sachs': 'GS', 'Volkswagen': 'VLKAY'}

      var req = {
        method: 'GET',
        url: 'http://fimatech.herokuapp.com/api/gethisto/'+companyMapper[$scope.company]+'/'
      };
      $http(req).then(function(response) {
	       $scope.stockDataResponse = response.data;
         $scope.selecteNewspaper('www.tmcnet.com');
      }, function(err) {
	       console.log(err);
      });

	    req = {
		    method: 'GET',
		    url: 'http://fimatech.herokuapp.com/api/newspaper/'+$scope.company+'/'
	    };


	    $http(req).then(function(response) {
		    $scope.best = response.data.best_impact;
		    $scope.worse = response.data.worse_impact;
		    $scope.max = response.data.max_impact;
	    }, function(err) {
		    console.log(err);
	    });
    };


    $scope.selecteNewspaper = function(newspaper) {
      // Load the newspaper data.
      var req = {
        method: 'GET',
        url: 'http://fimatech.herokuapp.com/api/articles/' + $scope.company + '/' + newspaper
      };
      $http(req).then(function(response) {
        $scope.articles = response.data;

        $scope.initializeChart();
        $scope.initializeArticles();
      }, function(err) {
         console.log(err);
      });
    };

    $scope.initializeChart = function() {
     // Data Initialization.
     var dataArray = [];
     var dataLabelsArray = [];
     var newsDataArray = [];

     // Process stock data.
     var labelsCount = 0
     angular.forEach($scope.stockDataResponse, function(data) {
       dataArray.push(data.open);
       if (labelsCount % 30 === 0) {
         dataLabelsArray.push(moment(data.timestamp).format('Do MMM'));
       } else {
         dataLabelsArray.push("")
       }
       labelsCount++;
     });

     // Process news data - Iterate over data array and find fitting timeslots.
     angular.forEach($scope.articles, function(data) {
       console.log(moment(data.publication_timestamp).format('MMMM Do YYYY, h:mm:ss a'));
     });

     // Draw the graphs.

     // Data chart configuration.
     var data = {
       labels: dataLabelsArray,
       datasets: [
         {
           label: "test",
           fillColor: "rgba(151,187,205,0.2)",
           strokeColor: "rgba(151,187,205,1)",
           pointColor: "rgba(151,187,205,1)",
           pointStrokeColor: "#fff",
           pointHighlightFill: "#fff",
           pointHighlightStroke: "rgba(151,187,205,1)",
           data: dataArray
         }
         // }, {
         //   label: "test",
         //   fillColor: "rgba(151,187,205,0.2)",
         //   strokeColor: "rgba(151,187,205,1)",
         //   pointColor: "rgba(0,0,0,0)",
         //   pointStrokeColor: "rgba(0,0,0,0)",
         //   pointHighlightFill: "rgba(0,0,0,0)",
         //   pointHighlightStroke: "rgba(0,0,0,0)",
         //   data: dataArray2,
         // }
       ]
     }

     var chartCanvas = document.getElementById("canvas").getContext("2d");
     var lineChart = new Chart(chartCanvas).Line(data);
    };

    $scope.initializeArticles = function() {

    };
  }
]);
