/**
 * Created by Anders on 2014-01-18.
 */

var Utils = (function() {

    function _isValidDate(input) {
        return (input !== null && input !== undefined && !isNaN(Date.parse(input)));
    }

    function _isValidDateRange(startDate, endDate) {
        if(!_isValidDate(startDate) || !_isValidDate(endDate)) {
            return false;
        }

        if (startDate >= endDate) {
            return false;
        }

        return true;
    }

    function _isArray(obj) {
        return obj !== undefined && obj !== null && Object.prototype.toString.call(obj) === '[object Array]';
    }

    function _deltaDate(date, delta) {
        return new Date(date.getTime() + (delta * 86400000));
    }

    return {
        isArray: _isArray,
        isValidDate: _isValidDate,
        isValidDateRange: _isValidDateRange,
        deltaDate: _deltaDate
    };

})();

module.exports = Utils;
