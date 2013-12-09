'use strict';

var GenericRepo = (function() {


    var mongoose = require('mongoose');

    function _list(fields, dbModel, restoreFunc, onSuccess, onError) {
        dbModel.find(null, fields, function(error, result) {
            if (error) {
                onError(error);
            } else {
                onSuccess(_restoreList(result, restoreFunc));
            }
        });
    }

    function _add(obj, DbModel, restoreFunc, onSuccess, onError) {
        if (!obj) {
            return onError('Invalid object!');
        }

        var newModel = new DbModel(obj);

        newModel.save(function(err, rawData) {
            if (err) {
                if (onError) {
                    return onError(err);
                }
            } else {
                if (onSuccess) {
                    return onSuccess(restoreFunc(rawData));
                }
            }
        });
    }

    function _update(obj, dbModel, restoreFunc, onSuccess, onError) {
        if (obj === undefined || obj === null) {
            return onError('Invalid model object');
        }

        var id = obj.id;
        delete obj.id;

        dbModel.update({ _id: id}, obj, { upsert: true }, function(err, numberAffected, rawData) {
            if (err) {
                onError(err);
            } else {
                onSuccess(restoreFunc(rawData));
            }
        });
    }

    function _getById(id, dbModel, restoreFunc, onSuccess, onError) {
        dbModel.findById(id, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(restoreFunc(doc));
            }
        });
    }

    function _find(searchObj, dbModel, restoreFunc, onSuccess, onError) {
        dbModel.findOne(searchObj, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(restoreFunc(doc));
            }
        });
    }

    function _deleteAllEntries(dbModel, callback) {
        dbModel.remove({}, callback);
    }

    function _restoreList(listDoc, restoreFunc) {
        var list = [];
        var count = listDoc.length;
        for (var i = 0; i < count; i++) {
            list.push(restoreFunc(listDoc[i]));
        }
        return list;
    }

    return {
        deleteAll: _deleteAllEntries,
        list: _list,
        add: _add,
        update: _update,
        getById: _getById,
        find: _find
    };


})();

module.exports = GenericRepo;