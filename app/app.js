'use strict';

var app = angular.module('myApp',[]);

app.controller("mycontrol", function($scope, $http) {
  $scope.day = moment();
  $scope.temp = '';
  $scope.name_of_person = '';
  $scope.senddata_reserve = function(){
    $scope.name_of_person = $scope.temp;
    $http.post(
        "http://localhost:3000/reserve",
        {
          "tennantName": $scope.name_of_person,
          "time": $scope.day.unix(),
          "reserved": true
        }).success(onSuccess).error(onFailure);
  };
  $scope.senddata_unreserve = function(){
    $scope.name_of_person = $scope.temp;
    $http.post(
        "http://localhost:3000/reserve",
        {
          "tennantName": $scope.name_of_person,
          "time": $scope.day.unix(),
          "reserved": false
        }).success(onSuccess).error(onFailure);
  };
  var onSuccess = function (data, status, headers, config) {
    console.log("Succesful");
  };
  var onFailure = function (data, status, headers, config) {
    console.log(status);
  };
});