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

          if ($scope.stockDataResponse) {
              $scope.initAssetHistory($scope.stockDataResponse);
          }
      }, function(err) {
	  console.log(err);
      });

	    req = {        
		    method: 'GET',
		    url: 'http://fimatech.herokuapp.com/api/newspaper/'+$scope.company+'/'
	    };
	    $http(req).then(function(response) {
		    $scope.best = response.data.sort(function(a,b) {
			    return b.best_impact > a.best_impact;
		    }).slice(0, 5);
		    $scope.max = response.data.sort(function(a,b) {
			    return b.max_impact > a.max_impact;
		    }).slice(0, 5);
		    $scope.worse = response.data.sort(function(a,b) {
			    return b.worse_impact > a.worse_impact;
		    }).slice(0, 5);
	    }, function(err) {
		    console.log(err);
	    });
		    
    };


    $scope.initAssetHistory = function(stockData) {
      //
      var dataArray = [];
      var dataLabelsArray = [];

      // Process stock data.
      var labelsCount = 0
      angular.forEach(stockData, function(data) {
        dataArray.push(data.open);
        if (labelsCount % 30 === 0) {
          dataLabelsArray.push(moment(data.timestamp).format('Do MMM'));
        } else {
          dataLabelsArray.push("")
        }
        labelsCount++;
      });

      // Process news data.


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
            data: dataArray,
            pointDot: false
          }, {
            label: "test",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: dataArray,
            pointDot: false
          }
        ]
      }

      var chartCanvas = document.getElementById("canvas").getContext("2d");
      var lineChart = new Chart(chartCanvas).Line(data, {

        showScale: true,
        scaleLineColor: "rgba(0,0,0,.1)",
        scaleLineWidth: 1,
        scaleShowLabels: true,
      });
    };
  }
]);
