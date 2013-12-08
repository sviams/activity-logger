'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test_timereg');

var TimeReg = require('../../../private/model/timereg');
var TimeRegRepo = require('../../../private/model/timeRegRepo');

var validTimeReg = new TimeReg(undefined, 'anActivity', 'aUser', '2013-12-05', '120', 'Did some stuff');

describe('TimeReg model', function() {

    /*
    afterEach(function(done) {
        UserRepo.deleteAll(function() {
            done();
        });
    });
    */

    it('should create a new timereg successfully', function(done) {

        TimeRegRepo.add(validTimeReg, function(successResult) {
            expect(successResult.id).toBeDefined();
            expect(successResult.activity).toEqual(validTimeReg.activity);
            done();
        }, function(error) {
            console.log(error);
            done(error);
        });
    });

    /*
    it('should fail to create a user when missing the email field', function(done) {

        var userWithMissingEmail = new User(undefined, 'invalidUserName', 'invalidPassword', 'invalidFirstName', 'invalidLastName', undefined, 99999);

        UserRepo.add(userWithMissingEmail, function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        });

    });

    it('should fail to create a user when input is null', function(done) {

        UserRepo.add(null, function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        });

    });

    it('should fail to create a user when input is undefined', function(done) {

        UserRepo.add(undefined, function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        });

    });

    it('should fail to update a user when input is null', function(done) {

        UserRepo.update(null, function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        });

    });

    it('should fail to update a user when input is undefined', function(done) {

        UserRepo.update(undefined, function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        });

    });

    it('should fail to list any users when empty', function(done) {

        UserRepo.list(function(successResult) {
            expect(successResult.length).toEqual(0);
            done();
        }, function(error) {
            done(error);
        });

    });

    describe('with a user', function() {

        beforeEach(function(done) {
            UserRepo.add(validUser, function(successResult) {
                done();
            }, function(error) {
                done(error);
            });
        });

        it('should return the correct user for the correct username', function(done) {
            UserRepo.find({ username: validUser.username}, function(successResult) {
                expect(successResult.username).toEqual(validUser.username);
                done();
            }, function(error) {
                done(error);
            });
        });

        it('should not find the wrong user for the wrong username', function(done) {
            UserRepo.find({ username: 'invalidUserName'}, function(successResult) {
                done(successResult);
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
        });

        it('should return the correct user for the correct email', function(done) {
            UserRepo.find({ email: validUser.email}, function(successResult) {
                expect(successResult.email).toEqual(validUser.email);
                done();
            }, function(error) {
                done(error);
            });
        });

        it('should not find the wrong user for the wrong email', function(done) {
            UserRepo.find({ email: 'no@exist.com'}, function(successResult) {
                done(successResult);
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
        });

        it('should find one user when listing all', function(done) {
            UserRepo.list(function(successResult) {
                expect(successResult.length).toEqual(1);
                expect(successResult[0].email).toEqual(validUser.email);
                done();
            }, function(error) {
                done(error);
            });
        });

    });
    */

});
