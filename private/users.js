// Dependencies

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

// set up db
mongoose.connect('mongodb://localhost/activitylogger');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to DB');
});

var localUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    role: { type: Number, required: true}
});

// Bcrypt middleware setup
localUserSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
localUserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

// Set up User DB access
var User = mongoose.model('User', localUserSchema);

exports.db = User;

var Roles = {
    Admin: 0,
    Manager: 1,
    User: 2
};

exports.Role = Roles;

// Seed the DB with a default admin user if there isn't one
User.findOne({ username: 'admin', role: Roles.Admin}, function(err, user) {
    if (err || user === null) {
        console.log("Didn't find an admin user, creating a default");
        var user = new User({ username: 'admin', password: 'changeme', firstName: 'System', lastName: 'Admin', email: 'admin@invalid', role: Roles.Admin});
        user.save(function(err) {
            if (err) console.log(err);
            else console.log('User ' + user.username + ' saved');
        });
    } else {
        console.log("Already had an admin user: " + user);
    }
});

// Seed the DB with a default admin user if there isn't one
User.findOne({ username: 'jimmy', role: Roles.Manager}, function(err, user) {
    if (err || user === null) {
        console.log("Didn't find an admin user, creating a default");
        var user = new User({ username: 'jimmy', password: 'changeme', firstName: 'Jimmy', lastName: 'Nilsson', email: 'jimmy@factor10.com', role: Roles.Manager});
        user.save(function(err) {
            if (err) console.log(err);
            else console.log('User ' + user.username + ' saved');
        });
    } else {
        console.log("Already had an admin user: " + user);
    }
});

// Seed the DB with a default admin user if there isn't one
User.findOne({ username: 'anders', role: Roles.User}, function(err, user) {
    if (err || user === null) {
        console.log("Didn't find an admin user, creating a default");
        var user = new User({ username: 'anders', password: 'changeme', firstName: 'Anders', lastName: 'Jändel', email: 'anders@factor10.com', role: Roles.User});
        user.save(function(err) {
            if (err) console.log(err);
            else console.log('User ' + user.username + ' saved');
        });
    } else {
        console.log("Already had an admin user: " + user);
    }
});


exports.authFunction = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

// set up passport
passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if(isMatch) {
                console.log('Accepted password for ' + username);
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

function list(req, res) {
    User.find(null, 'username email firstName lastName role _id', function(error, result) {
        if (error) res.error(503, 'Failed to load user list');
        else res.json(result);
    });
}

exports.list = list;

function postUser(req, res) {
    //if (req.params.userId) return updateUser(req, res, req.body);
    var user = req.body;
    if (user) {
        console.log('Got a valid user: ' + user.username + " " + user.firstName + " " + user.lastName + " " + user.email + " " + user.password + " " + user._id);
        //var dbUser = new User(user);

        dbUser.save(function(err, rawData) {
            if (err) {
                console.log(err);
                res.send(503, "Failed to save user");
            } else {
                console.log('User ' + rawData + ' saved');
                res.json(rawData);
            }
        });
    } else {
        console.log("Didn't get a valid user object");
        res.error(403, 'Invalid user');
    }
}

exports.post = postUser;

function updateUser(req, res, user) {
    delete user._id;

    User.update({ _id: req.params.userId}, user, { upsert: true }, function(err, numberAffected, rawData) {
        if (err) {
            console.log(err);
            res.send(503, "Failed to update user");
        } else {
            res.json(201, rawData);
        }
    });
}

exports.update = updateUser;

function getUser(req, res) {
    console.log('Got getUser request with userId ' + req.params.userId);
    User.findOne({ _id: req.params.userId }, function(err, user) {
        if (err || user === null) res.send(404, "Couldn't find user");
        else res.json(user);
    });
}

exports.get = getUser;