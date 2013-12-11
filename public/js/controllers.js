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
        var currentWeekday = today.getDay() - 1;
        console.log("Current weekday: " + currentWeekday);
        for (var i = 0; i < 7; i++) {
            var date = deltaDate(today, i-currentWeekday);
            $scope.week.push({
                label: weekdayLabels[i],
                date: date.getDate() + " " + monthLabels[date.getMonth()],
                total: 0
            });
        }
    }

    initWeek();

    $scope.rows = [];
    $scope.regs = TimeReg.list();
    $scope.projects = Project.list();

    $scope.rows.push({ name: "ActivityName", project: "TestProj"});

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

        modalInstance.result.then(function(selectedItem) {
            console.log("Got result from modal");
            console.log(selectedItem);
            $scope.rows.push(selectedItem);
        }, function() {
            console.log("Canceled");
        });

    }




}]);

alControllers.controller('ProjectPickerCtrl', ['$scope', '$modalInstance', 'projects', function($scope, $modalInstance, projects) {
    console.log(projects);

    $scope.projects = projects;



    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);