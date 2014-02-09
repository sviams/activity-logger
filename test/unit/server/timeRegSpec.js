'use strict';


var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/alTestDb');

var TimeReg = require('../../../private/model/timereg');
var TimeRegRepo = require('../../../private/model/timeRegRepo');
var Period = require('../../../private/model/period');

var validTimeReg = new TimeReg(undefined, 'anActivity', 'aUser', '2013-12-05', '120', 'Did some stuff');
var validQuery = { date: validTimeReg.date };
var invalidQuery = { date: '1989-11-12' };

var knownSetOfTimeRegs = [
    new TimeReg(undefined, 'activity1', 'user1', '2013-12-04', '40', 'Did some stuff'),
    new TimeReg(undefined, 'activity1', 'user1', '2013-12-05', '60', 'Did some stuff'),
    new TimeReg(undefined, 'activity2', 'user1', '2013-12-06', '80', 'Did some stuff'),
    new TimeReg(undefined, 'activity2', 'user1', '2013-12-07', '120', 'Did some stuff'),
    new TimeReg(undefined, 'activity1', 'user2', '2013-12-04', '60', 'Did some stuff'),
    new TimeReg(undefined, 'activity1', 'user2', '2013-12-05', '80', 'Did some stuff'),
    new TimeReg(undefined, 'activity2', 'user2', '2013-12-06', '120', 'Did some stuff'),
    new TimeReg(undefined, 'activity2', 'user2', '2013-12-07', '140', 'Did some stuff')
];

describe('TimeReg repo', function() {


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

        TimeRegRepo.all(function(successResult) {
            expect(successResult.length).toEqual(0);
            done();
        }, function(error) {
            done(error);
        }, null);

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
            TimeRegRepo.all(function(successResult) {
                expect(successResult.length).toEqual(1);
                expect(successResult[0].activity).toEqual(validTimeReg.activity);
                done();
            }, function(error) {
                done(error);
            }, null);
        });

        it('should find one timereg when listing by that date', function(done) {
            TimeRegRepo.match(function(successResult) {
                expect(successResult.length).toEqual(1);
                expect(successResult[0].activity).toEqual(validTimeReg.activity);
                done();
            }, function(error) {
                done(error);
            }, validQuery);
        });

        it('should find nothing when listing by another date', function(done) {
            TimeRegRepo.match(function(successResult) {
                expect(successResult.length).toEqual(0);
                done();
            }, function(error) {
                done(error);
            }, invalidQuery);
        });

    });

    describe('with multiple timeregs', function() {

        beforeEach(function(done) {
            TimeRegRepo.add(function(successResult) {
                done();
            }, function(error) {
                done(error);
            }, knownSetOfTimeRegs);
        });

        it('should find a timereg with a matching activity', function(done) {
            TimeRegRepo.find(function(successResult) {
                expect(successResult.activity).toEqual('activity1');
                done();
            }, function(error) {
                done(error);
            }, { activity: 'activity1'});
        });

        it('should not find a timereg with another activity name', function(done) {
            TimeRegRepo.find(function(successResult) {
                done(successResult);
            }, function(error) {
                expect(error).toBeDefined();
                done();
            }, { activity: 'somethingElse'});
        });

        it('should find eight timeregs when listing all', function(done) {
            TimeRegRepo.all(function(successResult) {
                expect(successResult.length).toEqual(8);
                expect(successResult[0].activity).toEqual('activity1');
                done();
            }, function(error) {
                done(error);
            }, null);
        });

        it('should find two timeregs when listing by that date', function(done) {
            TimeRegRepo.match(function(successResult) {
                expect(successResult.length).toEqual(2);
                expect(successResult[0].activity).toEqual('activity1');
                done();
            }, function(error) {
                done(error);
            }, { date: '2013-12-05'});
        });

        it('should find nothing when listing by another date', function(done) {
            TimeRegRepo.match(function(successResult) {
                expect(successResult.length).toEqual(0);
                done();
            }, function(error) {
                done(error);
            }, { date: '2025-10-03'});
        });

    });

});
