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
        $scope.currentUser.$save();
        $scope.users = User.list();
        $scope.isNewUser = false;
    }

    $scope.cancelCurrentUser = function() {
        console.log('Cancel editing current user');
        if ($scope.isNewUser) $scope.users.pop();
        $scope.currentUser = null;
    }

}]);

/*
var userListCtrl = function($scope, User) {
    $http.get('/users').success(function(data) {
        console.log("Loaded users from backend");
        $scope.users = data;
        //$scope.currentUser = $scope.users[0];
    }).error(function(err) {
            console.log("Failed to load user list");
        });

    $scope.setCurrentUser = function(user) {
        $scope.currentUser = user;
    }

     $scope.newUser = function() {
         $scope.currentUser = {};
         $scope.users.push($scope.currentUser);
         $scope.isNewUser = true;
     }

    $scope.saveCurrentUser = function() {
        console.log('Saving current user: ' + $scope.currentUser);
        $http.post('/user',  $scope.currentUser).success(function(data) {
            console.log('Successfully saved ' + data);
        }).error(function(err) {
                console.log('Failed to save current user');
            });
    }

    $scope.cancelCurrentUser = function() {
        console.log('Cancel editing current user');
        if ($scope.isNewUser) $scope.users.pop();
        $scope.currentUser = null;
    }
}

alControllers.controller('UserListCtrl', userListCtrl);
*/