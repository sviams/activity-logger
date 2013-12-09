'use strict';


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/alTestDb');

var TimeReg = require('../../../private/model/timereg');
var TimeRegRepo = require('../../../private/model/timeRegRepo');

var validTimeReg = new TimeReg(undefined, 'anActivity', 'aUser', '2013-12-05', '120', 'Did some stuff');

describe('TimeReg model', function() {


    afterEach(function(done) {
        TimeRegRepo.deleteAll(function() {
            done();
        });
    });


    it('should create a new timereg successfully', function(done) {

        TimeRegRepo.add(function(successResult) {
            expect(successResult.id).toBeDefined();
            expect(successResult.activity).toEqual(validTimeReg.activity);
            done();
        }, function(error) {
            console.log(error);
            done(error);
        }, validTimeReg);
    });



    it('should fail to create a timereg when input is null', function(done) {

        TimeRegRepo.add(function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        }, null);

    });

    it('should fail to create a timereg when input is undefined', function(done) {

        TimeRegRepo.add(function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        }, undefined);

    });

    it('should fail to update a timereg when input is null', function(done) {

        TimeRegRepo.update(function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        }, null);

    });

    it('should fail to update a timereg when input is undefined', function(done) {

        TimeRegRepo.update(function(successResult) {
            done(successResult);
        }, function(error) {
            expect(error).toBeDefined();
            done();
        }, undefined);

    });

    it('should fail to list any timeregs when empty', function(done) {

        TimeRegRepo.list(function(successResult) {
            expect(successResult.length).toEqual(0);
            done();
        }, function(error) {
            done(error);
        });

    });

    describe('with a timereg', function() {

        beforeEach(function(done) {
            TimeRegRepo.add(function(successResult) {
                done();
            }, function(error) {
                done(error);
            }, validTimeReg);
        });

        it('should find a timereg with a matching activity', function(done) {
            TimeRegRepo.find(function(successResult) {
                expect(successResult.activity).toEqual(validTimeReg.activity);
                done();
            }, function(error) {
                done(error);
            }, { activity: validTimeReg.activity});
        });

        it('should not find a timereg with another activity name', function(done) {
            TimeRegRepo.find(function(successResult) {
                done(successResult);
            }, function(error) {
                expect(error).toBeDefined();
                done();
            }, { activity: 'somethingElse'});
        });

        it('should find one timereg when listing all', function(done) {
            TimeRegRepo.list(function(successResult) {
                expect(successResult.length).toEqual(1);
                expect(successResult[0].activity).toEqual(validTimeReg.activity);
                done();
            }, function(error) {
                done(error);
            });
        });

    });


});
