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
      //$httpBackend.when('GET', '/users').


      $rootScope = $injector.get('$rootScope');

      var $controller = $injector.get('$controller');
      createController = function() {
          return $controller('UserListCtrl', {'$scope': $rootScope});
      }
    }));


    it('should create "users" model with 2 users fetched from xhr', function() {
      expect($rootScope.users).toBeUndefined();

      $httpBackend.expectGET('/users').respond([{name: 'admin'}, {name: 'andersj'}]);
      var controller = createController();
      $httpBackend.flush();

      expect($rootScope.users).toEqualData(
          [{name: 'admin'}, {name: 'andersj'}]);
    });

    it('should set current user successfully', function() {
        $httpBackend.expectGET('/users').respond([{name: 'admin'}, {name: 'andersj'}]);
        var controller = createController();
        $httpBackend.flush();

        $rootScope.setCurrentUser({ name: 'andersj'});

        expect($rootScope.currentUser.name).toEqual('andersj');
    });


    it('should create a new empty user and set it as current', function() {
        $httpBackend.expectGET('/users').respond([{name: 'admin'}, {name: 'andersj'}]);
        var controller = createController();
        $httpBackend.flush();

        $rootScope.newUser();

        expect($rootScope.currentUser).toBeDefined();

        expect($rootScope.users.length).toEqual(3);
    });

    it('should save the current user successfully', function() {
        $httpBackend.expectGET('/users').respond([{name: 'admin'}, {name: 'andersj'}]);
        var controller = createController();
        $httpBackend.flush();

        $rootScope.newUser();

        $rootScope.currentUser.name = 'pelle';

        $httpBackend.expectPOST('/users').respond(200);
        $httpBackend.expectGET('/users').respond([{name: 'admin'}, {name: 'andersj'}, {name: 'pelle'}]);
        $rootScope.saveCurrentUser();
        $httpBackend.flush();

        expect($rootScope.users.length).toEqual(3);
        expect($rootScope.isNewUser).toBeFalsy();
        expect($rootScope.users[2].name).toEqual('pelle');


    });

    it('should cancel the currently edited user', function() {
        $httpBackend.expectGET('/users').respond([{name: 'admin'}, {name: 'andersj'}]);
        var controller = createController();
        $httpBackend.flush();

        $rootScope.newUser();

        $rootScope.cancelCurrentUser();

        expect($rootScope.users.length).toEqual(2);
        expect($rootScope.isNewUser).toBeFalsy();
        expect($rootScope.currentUser).toBeUndefined();

    });

  });

});
