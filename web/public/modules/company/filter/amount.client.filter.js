'use strict';

angular.module('company').filter('dashboardAmountFilter', ['$cookieStore', function($cookieStore) {
  return function(transaction) {

    var user = $cookieStore.get('user');
    if (transaction.receiver.IBAN === user.IBAN) {
      return '+' + transaction.amount + ' Euro';
    } else {
      return '-' + transaction.amount + ' Euro';
    }
  }
}]);
