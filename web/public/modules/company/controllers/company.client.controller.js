'use strict';

angular.module('company').controller('CompanyController', ['$scope', '$http', '$location', '$cookieStore', 'Authentication', '$stateParams',
  function($scope, $http, $location, $cookieStore, Authentication, $stateParams) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    // Variable initizalization.
    $scope.data = [];
    $scope.labels = [];
    $scope.series = ['Data', 'News']

    // Initialize the passed state parameter.
    $scope.id = $stateParams.id;
    $scope.company = $scope.id;

    // Data chart configuration.
    $scope.optionsDataChart1 = {
        scaleShowGridLines: true,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: false,
        scaleShowLabels: true,
        scaleBeginAtZero: false,
        bezierCurve: false,
        animation: false,
        showScale: true,
        showTooltips: true,
        pointDot: false,
        pointDotRadius: 1,
        pointHitDetectionRadius: 1,
        datasetStrokeWidth: 0.3,
        maintainAspectRation: false,
        datasetFill: true
    };

    $scope.optionsDataChart2 = {
        scaleShowGridLines: true,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: false,
        scaleShowLabels: true,
        scaleBeginAtZero: false,
        bezierCurve: false,
        animation: false,
        showScale: true,
        showTooltips: true,
        pointDot: true,
        pointDotRadius: 3,
        pointHitDetectionRadius: 5,
        datasetStrokeWidth: 0.3,
        maintainAspectRation: false,
        datasetFill: true
    };


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


      // Draw the graphs.
      $scope.labels = dataLabelsArray
      $scope.data = []
      $scope.data.push(dataArray)
    };
  }
]);
