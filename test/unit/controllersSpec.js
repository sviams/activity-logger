'use strict';

/* jasmine specs for controllers go here */
describe('ActivityLogger controllers', function() {

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
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/users').
          respond([{name: 'admin'}, {name: 'andersj'}]);

      scope = $rootScope.$new();
      ctrl = $controller('UserListCtrl', {$scope: scope});
    }));


    it('should create "users" model with 2 users fetched from xhr', function() {
      expect(scope.users).toEqual([]);
      $httpBackend.flush();

      expect(scope.users).toEqualData(
          [{name: 'admin'}, {name: 'andersj'}]);
    });




  });

});
