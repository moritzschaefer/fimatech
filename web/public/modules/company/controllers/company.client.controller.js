'use strict';

var BASE_URL = 'http://localhost:8080/api/';

angular.module('company').controller('CompanyController', ['$scope', '$http', '$location', '$cookieStore', 'Authentication', '$stateParams', '$window',
  function($scope, $http, $location, $cookieStore, Authentication, $stateParams, $window) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    // Initialize the passed state parameter.
    $scope.id = $stateParams.id;
    $scope.company = $scope.id;

    // Filtering.
    $scope.tab = 'date';

    // Initialize the company data.
    $scope.initCompanyData = function() {
      var companyMapper = {'Apple': 'AAPL', 'IBM': 'IBM', 'Goldman Sachs': 'GS', 'Volkswagen': 'VLKAY'}

      var req = {
        method: 'GET',
        url: BASE_URL + 'gethisto/'+companyMapper[$scope.company]+'/'
      };
      $http(req).then(function(response) {
	       $scope.stockDataResponse = response.data;
      }, function(err) {
	       console.log(err);
      });

	    req = {
		    method: 'GET',
		    url: BASE_URL + 'newspaper/'+$scope.company+'/'
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
        url: BASE_URL + 'articles/' + $scope.company + '/' + newspaper
      };
      $http(req).then(function(response) {
        $scope.articles = response.data;
        $scope.relatedArticles = response.data;

        // Chart will work with $scope.articles data.
        $scope.initializeChart();

        // Related Articles will work with $scope.relatedArticles.
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
     var labelsCount = 0;
     var minData = null;
     var maxData = null;

     angular.forEach($scope.stockDataResponse, function(data) {
       dataArray.push(data.open);

       if (!minData || minData > data.open) {
         minData = data.open;
       }

       if (!maxData || maxData < data.open) {
         maxData = data.open;
       }

       if (labelsCount % 30 === 0) {
         dataLabelsArray.push(moment(data.timestamp, 'X').format('Do MMM'));
       } else {
         dataLabelsArray.push("")
       }
       labelsCount++;
     });

     // Add treshold.
     minData = minData - 30.0;
     maxData = maxData + 30.0;

     // Process news data - Iterate over data array and find fitting timeslots.
     $scope.articles.sort(function(prev, curr) {
       return prev.publication_timestamp - curr.publication_timestamp;
     });

     // TODO: Deuglify.
     var iterator = 0;
     angular.forEach($scope.stockDataResponse, function(stockData) {
       if ($scope.articles.length > iterator) {
         var stockDataDate = stockData.timestamp;
         var newsDate = $scope.articles[iterator].publication_timestamp;
        if (stockDataDate < newsDate) {
          newsDataArray.push(null)
        } else {
          newsDataArray.push(stockData.open)
          iterator++;
        }
      }
     });

     // Draw the graphs.

     // Data chart configuration.
     var data = {
       labels: dataLabelsArray,
       datasets: [
         {
           fillColor: "rgba(151,187,205,0.0)",
           strokeColor: "rgba(151,187,205,0)",
           pointColor: "rgba(255,0,90,1)",
           pointStrokeColor: "rgba(255,0,90,1)",
           pointHighlightFill: "rgba(255,0,90,1)",
           pointHighlightStroke: "rgba(255,0,90,1)",
           data: newsDataArray
         }, {
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
     var lineChart = new Chart(chartCanvas).Line(data, {
       scaleStartValue: minData,
       scaleEndValue: maxData
     });
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
      $scope.tab = 'date';
      if ($scope.relatedArticles.length > 0) {
        $scope.relatedArticles.sort(function(prev, curr) {
          return curr.publication_timestamp - prev.publication_timestamp;
        });
      }
    };

    $scope.orderByTitle = function() {
      $scope.tab = 'title';
      if ($scope.relatedArticles.length > 0) {
        $scope.relatedArticles.sort(function(prev, curr) {
          return curr.title.toLowerCase() - prev.title.toLowerCase();
        });
      }
    };

    $scope.orderByMaxScore = function() {
      $scope.tab = 'maxScore';
      if ($scope.relatedArticles.length > 0) {
        $scope.relatedArticles.sort(function(prev, curr) {
          return curr.score - prev.score;
        });
      }
    };

    $scope.orderByMinScore = function() {
      $scope.tab = 'minScore';
      if ($scope.relatedArticles.length > 0) {
        $scope.relatedArticles.sort(function(prev, curr) {
          return prev.score - curr.score;
        });
      }
    };

    $scope.view = function(url) {
      $window.open(url);
    };
  }
]);
