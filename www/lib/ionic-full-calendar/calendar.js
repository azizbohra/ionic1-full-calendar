angular.module('ionic-full-calendar', [])
  .filter('rangecal', function () {
    return function (input, total) {
      total = parseInt(total);

      for (var i = 0; i < total; i++) {
        input.push(i);
      }

      return input;
    };
  })

  .directive('myCalendar', function () {
    return {
      restrict: 'E',
      transclude: true,
      require: 'display',
      scope: {
        display: "=",
        dateformat: "=",
        callbackFn: '&'
      },
      templateUrl: 'lib/ionic-full-calendar/calendar.html',
      controller: ['$scope', '$filter', '$element', '$timeout', function ($scope, $filter, $element, $timeout) {

        var calMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // these are the days of the week for each month, in order
        var calDaysForMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        var selectedYear, selectedMonth, selectedDate, shortMonth;

        var CurrentDate = new Date();

        $scope.calMonths = [
          [{
            'id': 0,
            'name': 'Jan'
          }, {
            'id': 1,
            'name': 'Feb'
          }, {
            'id': 2,
            'name': 'Mar'
          }, {
            'id': 3,
            'name': 'Apr'
          }],
          [{
            'id': 4,
            'name': 'May'
          }, {
            'id': 5,
            'name': 'Jun'
          }, {
            'id': 6,
            'name': 'Jul'
          }, {
            'id': 7,
            'name': 'Aug'
          }],
          [{
            'id': 8,
            'name': 'Sep'
          }, {
            'id': 9,
            'name': 'Oct'
          }, {
            'id': 10,
            'name': 'Nov'
          }, {
            'id': 11,
            'name': 'Dec'
          }]
        ];

        selectedYear = CurrentDate.getFullYear();
        selectedMonth = CurrentDate.getMonth();
        selectedDate = CurrentDate.getDate();

        $scope.UICalendarDisplay = {};
        $scope.UICalendarDisplay.Date = true;
        $scope.UICalendarDisplay.Month = false;
        $scope.UICalendarDisplay.Year = false;

        $scope.displayCompleteDate = function () {
          var timeStamp = new Date(selectedYear, selectedMonth, selectedDate).getTime();
          if (angular.isUndefined($scope.dateformat)) {
            var format = "dd - MMM - yy";
          } else {
            var format = $scope.dateformat;
          }
          $scope.display = $filter('date')(timeStamp, format);

          // return date to callback function
          $scope.callbackFn({
            value: $scope.display
          });
        }

        //Onload Display Current Date
        $scope.displayCompleteDate();

        $scope.UIdisplayDatetoMonth = function () {
          $scope.UICalendarDisplay.Date = false;
          $scope.UICalendarDisplay.Month = true;
          $scope.UICalendarDisplay.Year = false;
        }

        $scope.UIdisplayMonthtoYear = function () {
          $scope.UICalendarDisplay.Date = false;
          $scope.UICalendarDisplay.Month = false;
          $scope.UICalendarDisplay.Year = true;
        }

        $scope.UIdisplayYeartoMonth = function () {
          $scope.UICalendarDisplay.Date = false;
          $scope.UICalendarDisplay.Month = true;
          $scope.UICalendarDisplay.Year = false;
        }
        $scope.UIdisplayMonthtoDate = function () {
          $scope.UICalendarDisplay.Date = true;
          $scope.UICalendarDisplay.Month = false;
          $scope.UICalendarDisplay.Year = false;
        }

        $scope.selectedMonthPrevClick = function () {
          selectedDate = 1;
          if (selectedMonth == 0) {
            selectedMonth = 11;
            selectedYear--;
          } else {
            $scope.dislayMonth = selectedMonth--;
          }
          $scope.displayMonthCalendar();
        }

        $scope.selectedMonthNextClick = function () {
          selectedDate = 1;
          if (selectedMonth == 11) {
            selectedMonth = 0;
            selectedYear++;
          } else {
            $scope.dislayMonth = selectedMonth++;
          }
          $scope.displayMonthCalendar();
        }

        $scope.selectedMonthYearPrevClick = function () {
          selectedYear--;
          $scope.displayYear = selectedYear;
          $scope.displayMonthCalendar();
        }

        $scope.selectedMonthYearNextClick = function () {
          selectedYear++;
          $scope.displayYear = selectedYear;
          $scope.displayMonthCalendar();
        }

        $scope.selectedDecadePrevClick = function () {
          selectedYear -= 10;
          $scope.displayMonthCalendar();
        }

        $scope.selectedDecadeNextClick = function () {
          selectedYear += 10;
          $scope.displayMonthCalendar();
        }

        $scope.selectedYearClick = function (year) {
          $scope.displayYear = year;
          selectedYear = year;
          $scope.displayMonthCalendar();
          $scope.UICalendarDisplay.Date = false;
          $scope.UICalendarDisplay.Month = true;
          $scope.UICalendarDisplay.Year = false;
          $scope.displayCompleteDate();
        }

        $scope.selectedMonthClick = function (month) {
          $scope.dislayMonth = month;
          selectedMonth = month;
          $scope.displayMonthCalendar();
          $scope.UICalendarDisplay.Date = true;
          $scope.UICalendarDisplay.Month = false;
          $scope.UICalendarDisplay.Year = false;
          $scope.displayCompleteDate();
        }

        $scope.selectedDateClick = function (date) {
          $scope.displayDate = date.date;
          selectedDate = date.date;

          if (date.type == 'newMonth') {
            var mnthDate = new Date(selectedYear, selectedMonth, 32)
            selectedMonth = mnthDate.getMonth();
            selectedYear = mnthDate.getFullYear();
            $scope.displayMonthCalendar();
          } else if (date.type == 'oldMonth') {
            var mnthDate = new Date(selectedYear, selectedMonth, 0);
            selectedMonth = mnthDate.getMonth();
            selectedYear = mnthDate.getFullYear();
            $scope.displayMonthCalendar();
          }
          $scope.displayCompleteDate();
        }

        $scope.displayMonthCalendar = function () {

          /*Year Display Start*/
          $scope.startYearDisp = (Math.floor(selectedYear / 10) * 10) - 1;
          $scope.endYearDisp = (Math.floor(selectedYear / 10) * 10) + 10;
          /*Year Display End*/

          $scope.datesDisp = [
            [],
            [],
            [],
            [],
            [],
            []
          ];
          countDatingStart = 1;

          if (calMonths[selectedMonth] === 'February') {
            if (selectedYear % 4 === 0) {
              endingDateLimit = 29;
            } else {
              endingDateLimit = 28;
            }
          } else {
            endingDateLimit = calDaysForMonth[selectedMonth];
          }
          startDay = new Date(selectedYear, selectedMonth, 1).getDay();

          $scope.displayYear = selectedYear;
          $scope.dislayMonth = calMonths[selectedMonth];
          $scope.shortMonth = calMonths[selectedMonth].slice(0, 3);

          $scope.displayDate = selectedDate;

          var nextMonthStartDates = 1;
          var prevMonthLastDates = new Date(selectedYear, selectedMonth, 0).getDate();

          for (i = 0; i < 6; i++) {
            if (typeof $scope.datesDisp[0][6] === 'undefined') {
              for (j = 0; j < 7; j++) {
                if (j < startDay) {
                  $scope.datesDisp[i][j] = {
                    "type": "oldMonth",
                    "date": (prevMonthLastDates - startDay + 1) + j
                  };
                } else {
                  $scope.datesDisp[i][j] = {
                    "type": "currentMonth",
                    "date": countDatingStart++
                  };
                }
              }
            } else {
              for (k = 0; k < 7; k++) {
                if (countDatingStart <= endingDateLimit) {
                  $scope.datesDisp[i][k] = {
                    "type": "currentMonth",
                    "date": countDatingStart++
                  };
                } else {
                  $scope.datesDisp[i][k] = {
                    "type": "newMonth",
                    "date": nextMonthStartDates++
                  };
                }
              }
            }

          }
        }
        $scope.displayMonthCalendar();

      }]
    };
  });
