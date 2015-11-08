'use strict';

angular.module('company').controller('CompanyController', ['$rootScope', '$scope', '$http', '$location', '$cookieStore', 'Authentication', '$stateParams', '$window',
  function($rootScope, $scope, $http, $location, $cookieStore, Authentication, $stateParams, $window) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    // Initialize the passed state parameter.
    $scope.id = $stateParams.id;
    $scope.company = $scope.id;

    // Filtering.
    $rootScope.tab = 'date';

    // Initialize the company data.
    $scope.initCompanyData = function() {
      var companyMapper = {'Apple': 'AAPL', 'IBM': 'IBM', 'Goldman Sachs': 'GS', 'Volkswagen': 'VLKAY'}

      var req = {
        method: 'GET',
        url: 'http://fimatech.herokuapp.com/api/gethisto/'+companyMapper[$scope.company]+'/'
      };
      $http(req).then(function(response) {
	       $scope.stockDataResponse = response.data;
         $scope.selectNewspaper('www.tmcnet.com');
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


    $scope.selectNewspaper = function(newspaper) {
      // Load the newspaper data.
      var req = {
        method: 'GET',
        url: 'http://fimatech.herokuapp.com/api/articles/' + $scope.company + '/' + newspaper
      };
      $http(req).then(function(response) {
        $scope.articles = response.data;

        $scope.initializeChart();
        $scope.orderByDate();
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

     });

     // Draw the graphs.

     // Data chart configuration.
     var data = {
       labels: dataLabelsArray,
       datasets: [
         {
           label: "test",
           fillColor: "rgba(151,187,205,0.0)",
           strokeColor: "rgba(151,187,205,0)",
           pointColor: "rgba(255,0,90,1)",
           pointStrokeColor: "rgba(255,0,90,1)",
           pointHighlightFill: "rgba(255,0,90,1)",
           pointHighlightStroke: "rgba(255,0,90,1)",
           data: dataArray
         }, {
           label: "test",
           fillColor: "rgba(151,187,205,0.2)",
           strokeColor: "rgba(151,187,205,1)",
           pointColor: "rgba(0,0,0,0)",
           pointStrokeColor: "rgba(0,0,0,0)",
           pointHighlightFill: "rgba(0,0,0,0)",
           pointHighlightStroke: "rgba(0,0,0,0)",
           data: dataArray
         }
       ]
     }

     var chartCanvas = document.getElementById("canvas").getContext("2d");
     var lineChart = new Chart(chartCanvas).Line(data);
    };

    $scope.dateForArticle = function(article) {
      return moment(article.publication_timestamp, 'X').format('MMMM Do YYYY, h:mm:ss a')
    };

    $scope.exportAsPDF = function() {
      // Hack to make all Charts accessable for rendering
      var item = angular.element(document.querySelectorAll('.pdf-printable'));
      html2canvas(item).then(function(canvas) {
          var dataURL = canvas.toDataURL({format: 'jpeg', quality: 1.0});
          var doc = new jsPDF();
          doc.text(35, 25, "Influence of '" + $scope.newspaper + "' on '" + $scope.company + "'.pdf");

          doc.addImage(dataURL, 'jpeg', 0, 30);
          doc.save("Influence of '" + $scope.newspaper + "' on '" + $scope.company + "'.pdf");
      });
    };

    $scope.orderByDate = function() {

    };

    $scope.orderByName = function() {

    };

    $scope.orderByMaxImpact = function() {

    };

    $scope.orderByBestImpact = function() {

    };

    $scope.orderByWorstImpact = function() {

    };

    $scope.view = function(url) {
      $window.open(url);
    };
  }
]);
