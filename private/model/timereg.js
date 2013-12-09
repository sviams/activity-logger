'use strict';

var TimeReg = (function() {

    function TimeReg(id, activity, user, date, duration, description) {
        this.id = id;
        this.activity = activity;
        this.user = user;
        this.date = date;
        this.duration = duration;
        this.description = description;
    }

    return TimeReg;

})();

module.exports = TimeReg;

module.exports.Status = {
    Created: 0,
    Committed: 1,
    Approved: 2,
    Invoiced: 3
};


module.exports.Parse = function(data, callback) {
    if (data === undefined || data === null) {
        return null;
    }

    if (data.activity === undefined || data.activity === null) {
        return null;
    }

    if (data.prototype !== TimeReg) {
        data.prototype = TimeReg;
    }

    return callback();
};

