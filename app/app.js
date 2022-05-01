'use strict';
// Creating the application module
var app = angular.module("myApp", []);

// Creating the application controller and adding the $http protocol to make our backend calls
app.controller("mycontrol", function($scope, $http) {
  // Defining the required variables
  $scope.day = moment();
  $scope.temp = '';
  $scope.name_of_person = '';
  $scope.data = [];
  // The reserve tennant function. It first saves the name of the tennant then pushes the data to the backend
  // At the end it pushes data into an array to tell us the steps in the reservation
  $scope.senddata_reserve = function(){
    $scope.name_of_person = $scope.temp;
    $http.post(
        "http://localhost:3000/reserve",
        {
          "tennantName": $scope.name_of_person,
          "time": $scope.day.unix(),
          "reserved": true
      }).success(onSuccess).error(onFailure);
    $scope.data.push('Reservation made for ' + $scope.name_of_person + ' on ' + $scope.day.format("MMMM D"));
    };
  // The unreserve tennant function. It first saves the name of the tennant then pushes the data to the backend
  // At the end it pushes data into an array to tell us the steps in the reservation
  $scope.senddata_unreserve = function(){
    $scope.name_of_person = $scope.temp;
    $http.post(
        "http://localhost:3000/reserve",
        {
          "tennantName": $scope.name_of_person,
          "time": $scope.day.unix(),
          "reserved": false
        }).success(onSuccess).error(onFailure);
    $scope.data.push('Reservation cancelled for ' + $scope.name_of_person + ' on ' + $scope.day.format("MMMM D"));
  };
  // Helper functions to tell us if the backend call was successful or not
  var onSuccess = function (data, status, headers, config) {
    console.log("Successful");
  };
  var onFailure = function (data, status, headers, config) {
    console.log("Failure");
  };
});

// Creating the calendar directive
app.directive("calendar", function() {
  return {
    // Setting up the necessary fields including the HTML template to be followed
    restrict: "E",
    templateUrl: "calendar.html",
    scope: {
      selected: "="
    },
    // Making the link function which registers the DOM object
    link: function(scope) {
      scope.selected = _removeTime(scope.selected || moment());
      scope.month = scope.selected.clone();

      var start = scope.selected.clone();
      start.date(1);
      _removeTime(start.day(0));

      _buildMonth(scope, start, scope.month);

      scope.select = function(day) {
        scope.selected = day.date;
      };

      scope.next = function() {
        var next = scope.month.clone();
        _removeTime(next.month(next.month()+1).date(1));
        scope.month.month(scope.month.month()+1);
        _buildMonth(scope, next, scope.month);
      };

      scope.previous = function() {
        var previous = scope.month.clone();
        _removeTime(previous.month(previous.month()-1).date(1));
        scope.month.month(scope.month.month()-1);
        _buildMonth(scope, previous, scope.month);
      };
    }
  };

  // Creating helper functions to help in creating the layout of the calendar.
  // These are called in the calendar directive
  function _removeTime(date) {
    return date.day(0).hour(0).minute(0).second(0).millisecond(0);
  }

  // This function builds the month
  function _buildMonth(scope, start, month) {
    scope.weeks = [];
    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
    while (!done) {
      scope.weeks.push({ days: _buildWeek(date.clone(), month) });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  // This function builds the week
  function _buildWeek(date, month) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      days.push({
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }
});