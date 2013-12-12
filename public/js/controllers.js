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
        console.log('Cancel editing current user');
        if ($scope.isNewUser) $scope.users.pop();
        $scope.isNewUser = false;
        $scope.currentUser = undefined;
    }

}]);

alControllers.controller('TimeCtrl', ['$scope', '$modal', 'TimeReg', 'Project', function($scope, $modal, TimeReg, Project) {

    function deltaDate(date, delta) {
        var ms = date.getTime();
        return new Date(ms + (delta * 86400000));
    }

    function initWeek() {
        weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $scope.week = []
        var today = new Date();
        currentWeekdayIndex = today.getDay() - 1;
        console.log("Current weekday: " + currentWeekdayIndex);
        for (var i = 0; i < 7; i++) {
            var date = deltaDate(today, i-currentWeekdayIndex);
            $scope.week.push({
                label: weekdayLabels[i],
                date: date.getDate() + " " + monthLabels[date.getMonth()],
                current: i === currentWeekdayIndex,
                total: 0
            });
        }
    }

    initWeek();

    $scope.rows = [];
    $scope.regs = TimeReg.list();
    $scope.projects = Project.list();

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
            $scope.rows.push({ activity: result.activity, project: result.project, time: new Array(7)});
        });

    }

    $scope.range = function(num) {
        return new Array(num);
    }

    $scope.rowTotal = function(row) {
        var result = 0;
        for (i in row.time) {
            var value = parseFloat(row.time[i]);
            if (!isNaN(value))
                result += value;
        }
        row.total = result;
        return result;
    }

    $scope.colTotal = function(colIndex) {
        var result = 0;
        for (i in $scope.rows) {
            var val = parseFloat($scope.rows[i].time[colIndex]);
            if (!isNaN(val)) {
                result += val;
            }
        }
        return result;
    }

    $scope.total = function() {
        var result = 0;
        for (i in $scope.rows) {
            var val = parseFloat($scope.rows[i].total);
            if (!isNaN(val)) {
                result += val;
            }
        }
        return result;
    }

}]);

alControllers.controller('ProjectPickerCtrl', ['$scope', '$modalInstance', 'projects', function($scope, $modalInstance, projects) {
    console.log(projects);

    $scope.projects = projects;

    $scope.project = projects[0];

    $scope.ok = function () {
        $modalInstance.close({ project: this.project, activity: this.activity});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);