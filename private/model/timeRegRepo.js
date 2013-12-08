'use strict';

var TimeRegRepo = (function() {

    var mongoose = require('mongoose');
    var TimeReg = require('./timereg');
    var GenericRepo = require('./genericRepo');

    function _restoreSingle(doc) {
        return new TimeReg(doc._id, doc.activity, doc.user, doc.date, doc.duration, doc.description);
    }

    function _restoreList(listDoc) {
        var list = [];
        var count = listDoc.length;
        for (var i = 0; i < count; i++) {
            list.push(_restoreSingle(listDoc[i]));
        }

        return list;
    }


    //this.prototype = GenericRepo;

    var _timeRegSchema = new mongoose.Schema({
        activity: { type: String, required: true},
        user: { type: String, required: true},
        date: { type: String, required: true},
        duration: { type: String, required: true},
        description: { type: String, required: true},
    });


    var TimeRegDbModel =  mongoose.model('TimeReg', _timeRegSchema);

    function _list(onSuccess, onError) {
        return list(TimeRegDbModel, 'activity user date duration description _id', onSuccess, onError);
    }

    /*
    function _list(onSuccess, onError) {
        TimeRegDbModel.find(null, 'activity user date duration description _id', function(error, result) {
            if (error) {
                onError(error);
            } else {
                onSuccess(_restoreTimeRegList(result));
            }
        });
    }
    */

    function _add(timeReg, onSuccess, onError) {
        return xadd(TimeRegDbModel, timeReg, onSuccess, onError);
    }

    /*
    function _add(onSuccess, onError, timeReg) {
        if (!timeReg) {
            return onError('Invalid timeReg!');
        }

        var newTimeReg = new TimeRegDbModel(timeReg);

        timeReg.save(function(err, rawData) {
            if (err) {
                if (onError) {
                    return onError(err);
                }
            } else {
                if (onSuccess) {
                    return onSuccess(_restoreTimeReg(rawData));
                }
            }
        });
    }
    */

    function _update(onSuccess, onError, timeReg) {
        if (!timeReg) {
            return onError('Invalid user object');
        }

        var id = timeReg.id;
        delete timeReg.id;

        TimeRegDbModel.update({ _id: id}, timeReg, { upsert: true }, function(err, numberAffected, rawData) {
            if (err) {
                onError(err);
            } else {
                onSuccess(_restoreTimeReg(rawData));
            }
        });
    }

    function _getById(onSuccess, onError, id) {
        TimeRegDbModel.findById(id, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(_restoreTimeReg(doc));
            }
        });
    }

    function _find(onSuccess, onError, searchObj) {
        TimeRegDbModel.findOne(searchObj, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(_restoreTimeReg(doc));
            }
        });
    }


    function _deleteAllEntries(callback) {
        UserDbModel.remove({}, callback);
    }


    return {
        prototype: GenericRepo,
        deleteAll: _deleteAllEntries,
        list: _list,
        add: _add,
        update: _update,
        getById: _getById,
        find: _find
    };

})();

module.exports = TimeRegRepo;