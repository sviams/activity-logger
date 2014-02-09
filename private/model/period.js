'use strict';

var Utils = require('../utils/utils');
var TimeReg = require('./timereg');
var TimeRegRepo = require('./timeregrepo');

var Period = (function() {

    function Period(startDate, endDate, activities) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.activities = activities;
    }

    return Period;

})();

module.exports = Period;

module.exports.get = function(onSuccess, onError, request) {
    var startDate = new Date(request.query.startDate);
    var endDate = new Date(request.query.endDate);

    if (!Utils.isValidDateRange(startDate, endDate)) {
        return onError("Invalid date range");
    }

    var result = new Period(startDate, endDate, {});

    var repo = require('./timeRegRepo');

    repo.match(function(matches) {

        for (var regIndex in matches) {
            var reg = matches[regIndex];
            if (result.activities[reg.activity] === undefined) {
                result.activities[reg.activity] = {};
            }
            result.activities[reg.activity][reg.date.toISOString().substring(0,10)] = reg.duration;
        }
        return onSuccess(result);
    }, function(err) {
        onError(err);
    }, { date: { $gte: startDate, $lt: endDate}, user: request.user.username });
};


module.exports.post = function(onSuccess, onError, req) {
    var period = req.body;
    if (!Utils.isValidDateRange(period.startDate, period.endDate)) {
        return onError("Invalid date range");
    }

    if (period.activities === undefined) {
        return onError("Invalid list of activities");
    }

    var timeRegs = [];

    for (var activityKey in period.activities) {
        var activity = period.activities[activityKey];
        for (var dateKey in activity) {
            var duration = activity[dateKey];
            if (duration !== undefined && duration > 0) {
                var newReg = new TimeReg(undefined, activityKey, req.user.username, new Date(dateKey), duration, undefined);
                timeRegs.push(newReg);
            }
        }
    }

    TimeRegRepo.add(function() {
        return Period.get(onSuccess, onError, req);
    }, onError, timeRegs);
};

