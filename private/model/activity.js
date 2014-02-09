'use strict';

var Activity = (function() {

    function Activity(name, description, isBillable, id) {
        this.name = name;
        this.description = description;
        this.isBillable = isBillable;
        this.id = id;
    }

    return Activity;

})();

module.exports = Activity;


module.exports.Parse = function(data, callback) {
    if (data === undefined || data === null) {return null;}

    if (data.name === undefined || data.name === null) {return null;}

    if (data.prototype !== Activity) {
        data.prototype = Activity;
    }

    return callback();
};

