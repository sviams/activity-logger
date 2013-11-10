'use strict';

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test_user');

var User = require('../../../private/model/userModel');

var validUser = {
    username: 'validUserName',
    password: 'validPassword',
    email: 'valid@email.com',
    firstName: 'validFirstName',
    lastName: 'validLastName',
    role: User.Role.User
}

var invalidUser = {
    username: 'invalidUserName',
    password: 'invalidPassword',
    firstName: 'invalidFirstName',
    lastName: 'invalidLastName',
    role: User.Role.User
}

describe('User model', function() {

    afterEach(function(done) {
        User.model.remove({}, function() {
            done();
        });
    });

    it('should create a new user successfully', function(done) {

        User.add(validUser, function(successResult) {
            expect(successResult._id).toBeDefined();
            expect(successResult.username).toEqual(validUser.username);
            done();
        }, function(error) {
            done(error);
        });
    });

    it('should fail to create a user when missing the email field', function(done) {

        User.add(invalidUser, function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        });

    });

    describe('with a user', function() {

        beforeEach(function(done) {
            User.add(validUser, function(successResult) {
                done();
            }, function(error) {
                done(error);
            });
        });

        it('should return the correct user for the correct username', function(done) {
            User.find({ username: validUser.username}, function(successResult) {
                expect(successResult.username).toEqual(validUser.username);
                done();
            }, function(error) {
                done(error);
            });
        });

        it('should not find the wrong user for the wrong username', function(done) {
            User.find({ username: invalidUser.username}, function(successResult) {
                done(successResult);
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
        });

        it('should return the correct user for the correct email', function(done) {
            User.find({ email: validUser.email}, function(successResult) {
                expect(successResult.email).toEqual(validUser.email);
                done();
            }, function(error) {
                done(error);
            });
        });

        it('should not find the wrong user for the wrong email', function(done) {
            User.find({ username: invalidUser.email}, function(successResult) {
                done(successResult);
            }, function(error) {
                expect(error).toBeDefined();
                done();
            });
        });

    });

});
