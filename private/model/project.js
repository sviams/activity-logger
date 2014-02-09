'use strict';

var Project = (function() {

    function Project(name, customer, activities, id) {
        this.name = name;
        this.customer = customer;
        this.activities = activities;
        this.id = id;
    }

    return Project;

})();

module.exports = Project;


module.exports.Parse = function(data, callback) {
    if (data === undefined || data === null) {return null;}

    if (data.name === undefined || data.name === null) {return null;}

    if (data.prototype !== Project) {
        data.prototype = Project;
    }

    return data;
};

