'use strict';

var GenericRepo = (function() {

    var Utils = require('../utils/utils');
    var mongoose = require('mongoose');

    function _getDbModel(name, schema) {
        try {
            var existingModel = mongoose.model(name);
            if (existingModel) {
                return existingModel;
            }
        } catch (e) {
            if (e.name === 'MissingSchemaError') {
                return mongoose.model(name, schema);
            }
        }
    }

    function _list(searchObj, fields, dbModel, restoreFunc, onSuccess, onError) {
        return dbModel.find(searchObj, fields, function(error, results) {
            if (error) {
                onError(error);
            } else {
                onSuccess(_restoreList(results, restoreFunc));
            }
        });
    }

    function _add(obj, DbModel, restoreFunc, onSuccess, onError) {
        if (!obj) {
            return onError('Invalid object!');
        }

        DbModel.create(obj, function(err, result) {
            if (err) {
                onError(err);
            } else {
                if (Utils.isArray(result)) {
                    onSuccess(_restoreList(result, restoreFunc));
                } else {
                    onSuccess(restoreFunc(result));
                }
            }
        });

        /*
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
        */
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
        find: _find,
        getDbModel: _getDbModel
    };


})();

module.exports = GenericRepo;