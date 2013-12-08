'use strict';

var Activity = (function() {

    function Activity(name, project, customer) {
        this.name = name;
        this.project = project;
        this.customer = customer;
    }

    return Activity;

})();

module.exports = Activity;


module.exports.Parse = function(data, callback) {
    if (data === undefined || data === null) return null;

    if (data.project === undefined || data.project === null) return null;

    if (data.prototype !== Activity)
        data.prototype = Activity;

    return data;
}

