/**
 * Created by Anders on 2013-10-23.
 */

var activityLoggerServices = angular.module('ActivityLoggerServices', ['ngResource']);

activityLoggerServices.factory('User', ['$resource', function($resource) {
    return $resource('/users/:userId', { userId: '@id' } , {
        list: { method: 'GET', params:{}, isArray:true}
    });
}]);

