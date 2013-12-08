'use strict';

var GenericRepo = (function() {


    var mongoose = require('mongoose');

    function _list(model, fields, onSuccess, onError) {
        model.find(null, fields, function(error, result) {
            if (error) {
                onError(error);
            } else {
                onSuccess(_restoreList(result));
            }
        });
    }

    function _add(modelType, obj, onSuccess, onErrors) {
        if (!obj) {
            return onError('Invalid object!');
        }

        var newModel = new modelType(obj);

        newModel.save(function(err, rawData) {
            if (err) {
                if (onError) {
                    return onError(err);
                }
            } else {
                if (onSuccess) {
                    return onSuccess(restoreFunction(rawData));
                }
            }
        });
    }

    function _update(onSuccess, onError, model, modelType, restoreFunction) {
        if (!model) {
            return onError('Invalid model object');
        }

        var id = model.id;
        delete model.id;

        modelType.update({ _id: id}, model, { upsert: true }, function(err, numberAffected, rawData) {
            if (err) {
                onError(err);
            } else {
                onSuccess(restoreFunction(rawData));
            }
        });
    }

    function _getById(onSuccess, onError, id, modelType, restoreFunction) {
        modelType.findById(id, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(restoreFunction(doc));
            }
        });
    }

    function _find(onSuccess, onError, searchObj, modelType) {
        modelType.findOne(searchObj, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(this._restoreSingle(doc));
            }
        });
    }

    function _deleteAllEntries(callback, modelType) {
        modelType.remove({}, callback);
    }

    return {
        deleteAll: _deleteAllEntries,
        list: _list,
        xadd: _add,
        update: _update,
        getById: _getById,
        find: _find
    };

})();

module.exports = GenericRepo;