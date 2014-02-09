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
