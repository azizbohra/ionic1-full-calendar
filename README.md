# ionic1-full-calendar

Simple Calendar for [Ionic](http://ionicframework.com/)

## Features

* simple
* easy to customize
* with on date select callback

## Usage
``` JavaScript
angular.module('starter', ['ionic', 'ionic-full-calendar'])

.controller('controller', function($scope) {

  // Initialise
  $scope.init = function () {
    $scope.selectedDate = "";
  };

  $scope.calendarCallback = function (value) {
    console.log(value);
  };
   
});
```

## Screenshots
<img src="www/img/screenshot-1.png" width="275">  <img src="www/img/screenshot-2.png" width="275">  <img src="www/img/screenshot-3.png" width="275">