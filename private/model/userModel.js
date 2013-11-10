'use strict';

var User = function() {


    var mongoose = require('mongoose');
    var bcrypt = require('bcryptjs');
    var SALT_WORK_FACTOR = 10;

    var _userRoles = {
        Admin: 0,
        Manager: 1,
        User: 2
    }

    var _userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        email: { type: String, required: true},
        firstName: { type: String, required: true},
        lastName: { type: String, required: true},
        role: { type: Number, required: true}
    });

    // Bcrypt middleware setup
    function _doHashPassword(user, onSuccess, onFailure) {
        if (!user || !user.password) return onFailure();

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if(err) return onFailure(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return onFailure(err);
                user.password = hash;
                return onSuccess();
            });
        });
    }

    function _hashPassword(next) {
        var user = this;

        if(!user.isModified('password')) return next();

        _doHashPassword(user, function() {
            next();
        }, function() {
            next(err);
        });
    }

    _userSchema.pre('save', _hashPassword);
    _userSchema.pre('update', _hashPassword);

    // Password verification
    _userSchema.methods.comparePassword = function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if(err) return callback(err);
            callback(null, isMatch);
        });
    };

    var _model =  mongoose.model('User', _userSchema);

    function _listUsers(onSuccess, onError) {
        _model.find(null, 'username email firstName lastName role _id', function(error, result) {
            if (error) onError(error)
            else onSuccess(result);
        });
    }

    function _addUser(user, onSuccess, onError) {
        if (!user) return onError('Invalid user!');

        var newUser = new _model(user);

        newUser.save(function(err, rawData) {
            if (err) {
                //console.log(err);
                return onError(err);
            } else {
                return onSuccess(rawData);
            }
        });
    }

    function _doUpdateUser(userId, user, onSuccess, onError) {
        _model.update({ _id: userId}, user, { upsert: true }, function(err, numberAffected, rawData) {
            if (err) {
                //console.log(err);
                onError(err);
            } else {
                onSuccess(rawData);
            }
        });
    }

    function _updateUser(user, onSuccess, onError) {
        var id = user._id;
        delete user._id;

        if (user.password) {
            _doHashPassword(user, function() {
                _doUpdateUser(id, user, onSuccess, onError);
            }, function() {
                onError('Failed to hash password');
            });
        } else {
            _doUpdateUser(id, user, onSuccess, onError);
        }
    }

    function _getUserById(userId, onSuccess, onError) {
        _model.findById(userId, function(err, user) {
            if (err || user === null) onError(err);
            else onSuccess(user);
        });
    }

    function _findUser(searchObj, onSuccess, onError) {
        _model.findOne(searchObj, function(err, user) {
            if (err || user === null) onError(err);
            else onSuccess(user);
        });
    }

    return {
        model: _model,
        Role: _userRoles,
        list: _listUsers,
        add: _addUser,
        update: _updateUser,
        getById: _getUserById,
        find: _findUser
    };

}();

module.exports = User;