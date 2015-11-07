'use strict';

angular.module('company').controller('CompanyController', ['$scope', '$http', '$location', '$cookieStore', 'Authentication', '$stateParams',
  function($scope, $http, $location, $cookieStore, Authentication, $stateParams) {
    $scope.authentication = Authentication;
    // If user is not signed in then redirect back home
    if (!$scope.authentication.user) $location.path('/');

    $scope.labels = [];
    var series = 'Balance: ' + $scope.authentication.user.balance + ' Euro';
    $scope.series = [series];
    $scope.data = [];

    $scope.id = $stateParams.id;

    $scope.initDashboard = function() {
      var req = {
        method: 'GET',
        url: 'http://localhost:8888/index.php/transactions'
      };
      $http(req).then(function(response) {
        $scope.transactions = response.data;

        // 1. Display Asset History Data.
        $scope.initAssetHistory($scope.transactions);

        // 2. Sort Array and Display Recent Transactions.
        $scope.transactions.sort(function(prev, curr) {
          return new Date(curr.transactionDate) - new Date(prev.transactionDate);
        });
      }, function() {
        // TODO: Remove code in stars and handle error.
        /***********************************/
        /***********************************/
        /***********************************/
        /***********************************/
        $scope.transactions = [{
          "identifier": "5630cb38e096ef331126663e",
          "sender": {
            "displayName": "Philip Kluz",
            "IBAN": "DE89 3704 0044 0532 0130 00",
            "BIC": "ABL1313"
          },
          "receiver": {
            "displayName": "Robert Weindl",
            "IBAN": "DE89 3704 0044 0532 0130 01",
            "BIC": "LASD231"
          },
          "amount": 500.00,
          "description": "Secure Coding Work",
          "transactionDate": "2015-10-28T13:18:48.478Z"
        }, {
          "identifier": "5630cb38e096ef331126663e",
          "sender": {
            "displayName": "Robert Weindl",
            "IBAN": "DE89 3704 0044 0532 0130 01",
            "BIC": "ABL1313"
          },
          "receiver": {
            "displayName": "Philip Kluz",
            "IBAN": "DE89 3704 0044 0532 0130 00",
            "BIC": "LASD231"
          },
          "amount": 400.00,
          "description": "A very intelligent description.",
          "transactionDate": "2015-10-28T15:01:22.478Z"
        }, {
          "identifier": "5630cb38e096ef331126663e",
          "sender": {
            "displayName": "Philip Kluz",
            "IBAN": "DE89 3704 0044 0532 0130 00",
            "BIC": "ABL1313"
          },
          "receiver": {
            "displayName": "Robert Weindl",
            "IBAN": "DE89 3704 0044 0532 0130 01",
            "BIC": "LASD231"
          },
          "amount": 200.00,
          "description": "Secure Coding Work",
          "transactionDate": "2015-10-28T19:29:20.478Z"
        }, {
          "identifier": "5630cb38e096ef331126663e",
          "sender": {
            "displayName": "Philip Kluz",
            "IBAN": "DE89 3704 0044 0532 0130 00",
            "BIC": "ABL1313"
          },
          "receiver": {
            "displayName": "Robert Weindl",
            "IBAN": "DE89 3704 0044 0532 0130 01",
            "BIC": "LASD231"
          },
          "amount": 500.00,
          "description": "Secure Coding Work",
          "transactionDate": "2015-10-28T20:17:20.478Z"
        }];

        // 1. Display Asset History Data.
        $scope.initAssetHistory($scope.transactions);

        // 2. Sort Array and Display Recent Transactions.
        $scope.transactions.sort(function(prev, curr) {
          return new Date(curr.transactionDate) - new Date(prev.transactionDate);
        });
        /***********************************/
        /***********************************/
        /***********************************/
        /***********************************/
      });
    };

    $scope.initAssetHistory = function(transactions) {
      var labels = []
      var data = []
      var balance = 0
      var user = $cookieStore.get('user')

      angular.forEach(transactions, function(transaction, key) {
        if (key === 0) {
          data.push(balance)
          labels.push(moment(transaction.transactionDate).format('Do MMM, HH:mm'));
        }

        labels.push(moment(transaction.transactionDate).format('Do MMM, HH:mm'));
        // Check here if sender or receiver is user.
        if (transaction.sender.IBAN === user.IBAN) {
          balance -= transaction.amount
        } else if (transaction.receiver.IBAN === user.IBAN) {
          balance += transaction.amount
        }

        data.push(balance)
      })

      $scope.labels = labels
      $scope.data = []
      $scope.data.push(data)
    };

    $scope.isPositiveTransaction = function(transaction) {
      var user = $cookieStore.get('user');
      if (transaction.receiver.IBAN === user.IBAN) {
        return true;
      } else {
        return false;
      }
    };
  }
]);
