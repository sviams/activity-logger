/**
 * Created by Anders on 2013-10-22.
 */

var alControllers = angular.module('ActivityLoggerControllers', []);

alControllers.controller('UserListCtrl', ['$scope', 'User', function($scope, User) {
    $scope.users = User.list();

    $scope.setCurrentUser = function(user) {
        $scope.currentUser = user;
    }

    $scope.newUser = function() {
        $scope.currentUser = new User();
        $scope.users.push($scope.currentUser);
        $scope.isNewUser = true;
    }

    $scope.saveCurrentUser = function() {
        if ($scope.currentUser) {
            $scope.currentUser.$save();
            $scope.users = User.list();
            $scope.isNewUser = false;
        }
    }

    $scope.cancelCurrentUser = function() {
        if ($scope.isNewUser) $scope.users.pop();
        $scope.isNewUser = false;
        $scope.currentUser = undefined;
    }

}]);

alControllers.controller('WeekCtrl', ['$scope', '$modal', '$routeParams', '$location', 'Project', 'Period', function($scope, $modal, $routeParams, $location, Project, Period) {

    function deltaDate(date, delta) {
        var ms = date.getTime();
        return new Date(ms + (delta * 86400000));
    }

    function isValidDate(input) {
        return (input != null && input != undefined && !isNaN(Date.parse(input)))
    }

    function getStartOfWeekForDay(day) {
        var weekDayIndex = day.getDay() -1;
        if (weekDayIndex === -1) {
            weekDayIndex = 6; // Sundays
        }
        return deltaDate(day, -weekDayIndex);
    }

    $scope.isCurrentWeek = false;

    function initWeek(startDate) {
        weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.week = []

        var today = new Date();
        $scope.isCurrentWeek = false;

        for (var i = 0; i < 7; i++) {
            var date = deltaDate(startDate, i);
            if (date.getDate() === today.getDate()) {
                $scope.isCurrentWeek = true;
            }
            $scope.week.push({
                label: weekdayLabels[i],
                dateLabel: date.getDate() + " " + monthLabels[date.getMonth()],
                date: date.toISOString().substring(0, 10),
                current: date.getDate() === today.getDate(),
                total: 0
            });
        }
    }

    function loadWeek(startDay) {
        initWeek(startDay);
        $location.search('startDate', startDay.toISOString().substring(0, 10));
        $scope.period = Period.get({ startDate: $scope.week[0].date, endDate: $scope.week[$scope.week.length-1].date})
    }

    function onLoad() {
        var startDay = isValidDate($routeParams.startDate) ? getStartOfWeekForDay($routeParams.startDate) : getStartOfWeekForDay(new Date());
        $scope.projects = Project.list();
        loadWeek(startDay);
    }

    onLoad();


    $scope.onAddRow = function() {

        var modalInstance = $modal.open({
            templateUrl: '/modal/projectpicker',
            controller: 'ProjectPickerCtrl',
            resolve: {
                projects: function() {
                    return $scope.projects;
                }
            }
        });

        modalInstance.result.then(function(result) {
            $scope.period.activities[result.activity] = {}
        });

    }

    $scope.onSave = function() {
        console.log($scope.period);
        $scope.period.$save().then(console.log($scope.period));
    }

    $scope.changeWeek = function(deltaWeeks) {
        var startDay = deltaDate(new Date(Date.parse($scope.week[0].date)), (deltaWeeks * 7));
        loadWeek(startDay);
    }

    $scope.goToCurrentWeek = function() {
        loadWeek(getStartOfWeekForDay(new Date()));
    }

    $scope.range = function(num) {
        return new Array(num);
    }

    $scope.activityName = function(activity) {
        for (var projIndex in $scope.projects) {
            var project = $scope.projects[projIndex];
            if (project.activities === undefined) {
                return;
            }

            if (project.activities[activity] != undefined) {
                return project.activities[activity].name;
            }
        }
        return "Unknown activity";
    }

    $scope.projectNameByActivity = function(activity) {
        for (var projIndex in $scope.projects) {
            var project = $scope.projects[projIndex];
            if (project.activities === undefined) {
                return;
            }
            if (project.activities[activity] != undefined) {
                return project.name;
            }
        }
        return "Unknown activity";
    }

    $scope.activityTotal = function(activity) {
        var result = 0;
        for (i in activity) {
            var value = parseFloat(activity[i]);
            if (!isNaN(value))
                result += value;
        }
        return result;
    }

    $scope.dayTotal = function(day) {
        var result = 0;
        for (i in $scope.period.activities) {
            var val = parseFloat($scope.period.activities[i][day.date]);
            if (!isNaN(val)) {
                result += val;
            }
        }
        return result;
    }

    $scope.total = function() {
        var result = 0;
        if ($scope.period != undefined) {
            for (i in $scope.period.activities) {
                result += $scope.activityTotal($scope.period.activities[i]);
            }
        }
        return result;
    }

}]);

alControllers.controller('ProjectPickerCtrl', ['$scope', '$modalInstance', 'projects', function($scope, $modalInstance, projects) {
    $scope.projects = projects;

    $scope.project = projects[0];

    $scope.ok = function () {
        $modalInstance.close({ project: this.project, activity: this.activity});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);