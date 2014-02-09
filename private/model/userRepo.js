'use strict';

var UserRepo = (function() {


    var mongoose = require('mongoose');
    var User = require('./user');
    var GenericRepo = require('./genericRepo');

    var _userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        email: { type: String, required: true},
        firstname: { type: String, required: true},
        lastname: { type: String, required: true},
        role: { type: Number, required: true}
    });

/*
    _userSchema.pre('save', function(next) {
        User.hashPasswordIfChanged(this, next);
    });
*/
    // Password verification
    _userSchema.methods.comparePassword = function(candidatePassword, callback) {
        User.comparePassword(this, candidatePassword, callback);
    };

    var UserDbModel =  mongoose.model('User', _userSchema);

    function _seedUser(user) {

        if (!user) {
            console.log('User undefined, not seeding');
            return;
        }

        UserDbModel.find({ username: user.username, role: user.role}, function(err, userResult) {
            if (err || !userResult || userResult.length === 0) {
                console.log('Hashing password for ' + user.username);
                user.hashPassword(function(successResult) {
                    console.log('Seeding database with user ' + user.username + ' and role ' + user.role);
                    UserRepo.add(function() {}, function() {}, user);
                });

            } else {
                console.log('Already had user ' + user.username + ', no need to seed');
            }
        });
    }

    function _listUsers(onSuccess, onError) {
        return GenericRepo.list(null, 'username email firstname lastname role _id', UserDbModel, _restoreUser, onSuccess, onError);
    }

    function _addUser(onSuccess, onError, user) {
        return GenericRepo.add(user, UserDbModel, _restoreUser, onSuccess, onError);
    }

    function _updateUser(onSuccess, onError, user) {
        return GenericRepo.update(user, UserDbModel, _restoreUser, onSuccess, onError);
    }

    function _getUserById(onSuccess, onError, userId) {
        return GenericRepo.getById(userId, UserDbModel, _restoreUser, onSuccess, onError);
    }

    function _findUser(onSuccess, onError, searchObj) {
        return GenericRepo.find(searchObj, UserDbModel, _restoreUser, onSuccess, onError);
    }

    function _deleteAllEntries(callback) {
        return GenericRepo.deleteAll(UserDbModel, callback);
    }

    function _restoreUser(doc) {
        return new User(doc._id, doc.username, doc.password, doc.firstname, doc.lastname, doc.email, doc.role);
    }

    return {
        add: _addUser,
        deleteAll: _deleteAllEntries,
        all: _listUsers,
        update: _updateUser,
        getById: _getUserById,
        find: _findUser,
        seedUser: _seedUser
    };
})();

module.exports = UserRepo;