/**
 * Created by Anders on 2013-10-23.
 */

var activityLoggerServices = angular.module('ActivityLoggerServices', ['ngResource']);

activityLoggerServices.factory('User', ['$resource', function($resource) {
    return $resource('/users/:userId', { userId: '@id' } , {
        list: { method: 'GET', params:{}, isArray:true}
    });
}]);

activityLoggerServices.factory('TimeReg', ['$resource', function($resource) {
    return $resource('/timereg/:regId', { regId: '@id' } , {
        list: { method: 'GET', params:{}, isArray:true}
    });
}]);

activityLoggerServices.factory('Project', ['$resource', function($resource) {
    return $resource('/project/:projectId', { regId: '@id' } , {
        list: { method: 'GET', params:{}, isArray:true}
    });
}]);

activityLoggerServices.factory('Period', ['$resource', function($resource) {
    return $resource('/period/', { startDate: '@startDate', endDate: '@endDate'});
}]);
