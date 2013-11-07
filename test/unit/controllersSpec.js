'use strict';

/* jasmine specs for controllers go here */
describe('ActivityLogger controller', function() {

  beforeEach(function() {
      this.addMatchers({
          toEqualData: function(expected) {
              return angular.equals(this.actual, expected);
          }
      });
  });

  beforeEach(module('ActivityLogger'));
  beforeEach(module('ActivityLoggerServices'));

  describe('UserListCtrl', function(){
    var $rootScope, $httpBackend, createController;

    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/users').
          respond([{name: 'admin'}, {name: 'andersj'}]);

      $rootScope = $injector.get('$rootScope');

      var $controller = $injector.get('$controller');
      createController = function() {
          return $controller('UserListCtrl', {'$scope': $rootScope});
      }
    }));


    it('should create "users" model with 2 users fetched from xhr', function() {
      expect($rootScope.users).not.toBeDefined();

      $httpBackend.expectGET('/users');
      var controller = createController();
      $httpBackend.flush();

      expect($rootScope.users).toEqualData(
          [{name: 'admin'}, {name: 'andersj'}]);
    });




  });

});
