'use strict';

var TimeRegRepo = (function() {

    var mongoose = require('mongoose');
    var TimeReg = require('./timereg');
    var GenericRepo = require('./genericRepo');

    function _restoreSingle(doc) {
        return new TimeReg(doc._id, doc.activity, doc.user, doc.date, doc.duration, doc.description);
    }

    var _timeRegSchema = new mongoose.Schema({
        activity: { type: String, required: true},
        user: { type: String, required: true},
        date: { type: String, required: true},
        duration: { type: String, required: true},
        description: { type: String, required: true},
    });


    var TimeRegDbModel =  mongoose.model('TimeReg', _timeRegSchema);

    function _list(onSuccess, onError) {
        return GenericRepo.list('activity user date duration description _id', TimeRegDbModel, _restoreSingle, onSuccess, onError);
    }

    function _add(onSuccess, onError, timeReg) {
        return GenericRepo.add(timeReg, TimeRegDbModel, _restoreSingle, onSuccess, onError);
    }

    function _update(onSuccess, onError, timeReg) {
        return GenericRepo.update(timeReg, TimeRegDbModel, _restoreSingle, onSuccess, onError);
    }

    function _getById(onSuccess, onError, id) {
        return GenericRepo.getById(id, TimeRegDbModel, _restoreSingle, onSuccess, onError);
    }

    function _find(onSuccess, onError, searchObj) {
        return GenericRepo.find(searchObj, TimeRegDbModel, _restoreSingle, onSuccess, onError);
    }

    function _deleteAllEntries(callback) {
        return GenericRepo.deleteAll(TimeRegDbModel, callback);
    }

    return {
        add: _add,
        deleteAll: _deleteAllEntries,
        list: _list,
        update: _update,
        getById: _getById,
        find: _find
    };
})();

module.exports = TimeRegRepo;