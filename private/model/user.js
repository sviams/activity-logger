'use strict';

var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var User = (function() {

    function User(id, username, password, firstname, lastname, email, role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.role = role;
    }



    // Bcrypt middleware setup

    User.prototype.hashPassword = function(onSuccess, onFailure) { User.hashPassword(this, onSuccess, onFailure); };

    return User;

})();

module.exports = User;

module.exports.Roles = {
    Admin: 0,
    Manager: 1,
    Consultant: 2
};

module.exports.hashPassword = function(user, onSuccess, onFailure) {
    if (!user.password) {
        return onSuccess();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
            return onFailure(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                return onFailure(err);
            }
            user.password = hash;
            return onSuccess();
        });
    });
};

module.exports.hashPasswordIfChanged = function(user, next) {

    if(!user.isModified('password')) {
        return next();
    }

    User.hashPassword(user, function() {
        next();
    }, function(err) {
        next(err);
    });
};

module.exports.comparePassword = function(user, candidatePassword, callback) {
    console.log('Comparing pass ' + candidatePassword + ' with ');
    console.log(user);
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        if(err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

