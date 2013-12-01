'use strict';

var UserRepo = (function() {


    var mongoose = require('mongoose');
    var User = require('./user');

    var _userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        email: { type: String, required: true},
        firstname: { type: String, required: true},
        lastname: { type: String, required: true},
        role: { type: Number, required: true}
    });

    var UserDbModel =  mongoose.model('User', _userSchema);

    function _seedUser(user) {

        if (!user) {
            console.log('User undefined, not seeding');
            return;
        }

        User.Parse(user, function () {
            UserDbModel.find({ username: user.username, role: user.role}, function(err, userResult) {
                if (err || !userResult || userResult.length === 0) {
                    console.log('Seeding database with user ' + user.username + ' and role ' + user.role);
                    _addUser(null, null, user);
                } else {
                    console.log('Already had user ' + user.username + ', no need to seed');
                }
            });
        });
    }


    function _listUsers(onSuccess, onError) {
        UserDbModel.find(null, 'username email firstname lastname role _id', function(error, result) {
            if (error) {
                onError(error);
            } else {
                onSuccess(_restoreUserList(result));
            }
        });
    }

    function _addUser(onSuccess, onError, user) {
        if (!user) {
            return onError('Invalid user!');
        }

        var newUser = new UserDbModel(user);

        newUser.save(function(err, rawData) {
            if (err) {
                if (onError) {
                    return onError(err);
                }
            } else {
                if (onSuccess) {
                    return onSuccess(_restoreUser(rawData));
                }
            }
        });
    }

    function _doUpdateUser(userId, user, onSuccess, onError) {
        UserDbModel.update({ _id: userId}, user, { upsert: true }, function(err, numberAffected, rawData) {
            if (err) {
                onError(err);
            } else {
                onSuccess(_restoreUser(rawData));
            }
        });
    }

    function _updateUser(onSuccess, onError, user) {
        if (!user) {
            return onError('Invalid user object');
        }

        var id = user.id;
        delete user.id;

        _doUpdateUser(id, user, onSuccess, onError);

    }

    function _getUserById(onSuccess, onError, userId) {
        UserDbModel.findById(userId, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(_restoreUser(doc));
            }
        });
    }

    function _findUser(onSuccess, onError, searchObj) {
        UserDbModel.findOne(searchObj, function(err, doc) {
            if (err || doc === null) {
                onError(err);
            } else {
                onSuccess(_restoreUser(doc));
            }
        });
    }

    function _restoreUser(doc) {
        return new User(doc._id, doc.username, doc.password, doc.firstname, doc.lastname, doc.email, doc.role);
    }

    function _restoreUserList(listDoc) {
        var userList = [];
        var userCount = listDoc.length;
        for (var i = 0; i < userCount; i++) {
            userList.push(_restoreUser(listDoc[i]));
        }

        return userList;
    }

    function _deleteAllEntries(callback) {
        UserDbModel.remove({}, callback);
    }

    return {
        deleteAll: _deleteAllEntries,
        seedUser: _seedUser,
        list: _listUsers,
        add: _addUser,
        update: _updateUser,
        getById: _getUserById,
        find: _findUser
    };

})();

module.exports = UserRepo;