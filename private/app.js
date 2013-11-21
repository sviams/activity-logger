
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var UserRepo = require('./model/userRepo');
var User = require('./model/user');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../bower_components')));

// set up db
mongoose.connect('mongodb://localhost/activitylogger');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to DB');
});

// Connect function for ensuring authorization before access
function authRequired(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}



// Connect function for ensuring that the user has the correct role
function restrictedToRole(role) {
    return function(req, res, next) {
        if (req.user.role <= role) {
            next();
        } else {
            console.log('User role is ' + req.user.role + ' and requirement is ' + role);
            next(new Error('Insufficient permissions'));
        }
    };
}

// set up passport
passport.use(new LocalStrategy(function(username, password, done) {
    UserRepo.find({username: username}, function(user) {
        User.comparePassword(user, password, function(err, isMatch) {
            if (err) {
                return done(err);
            }

            if(isMatch) {
                console.log('Accepted password for ' + username);
                return done(null, user);

            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    }, function(error) {
        return done(error);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    UserRepo.getById(id, function(user) {
        done(undefined, user);
    }, function(err) {
        done(err, undefined);
    });
});

var authFunction = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

console.log(User.Roles);



// Seed the database with default data
UserRepo.deleteAll(function() {
    UserRepo.seedUser(new User(undefined, 'admin', 'changeme', 'System', 'Admin', 'admin@invalid', User.Roles.Admin));
    UserRepo.seedUser(new User(undefined, 'jimmy', 'changeme', 'Jimmy', 'Nilsson', 'jimmy@factor10.com', User.Roles.Manager));
    UserRepo.seedUser(new User(undefined, 'anders', 'changeme', 'Anders', 'Jändel', 'anders@factor10.com', User.Roles.Consultant));
});


app.get('/login', routes.login);
app.get('/', authRequired, restrictedToRole(User.Roles.Consultant), routes.index);
//app.get('/users', authRequired, restrictedToRole(User.Roles.Manager), Users.list);
app.get('/admin', authRequired, restrictedToRole(User.Roles.Admin),routes.admin);
app.post('/login', authFunction);
app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});


app.post('/users/:userId', authRequired, restrictedToRole(User.Roles.Admin), function(req, res) {
    UserRepo.update(req.body, function(jsonData) {
        res.json(201, jsonData);
    }, function(error) {
        res.send(500, error);
    });
});

app.post('/users', authRequired, restrictedToRole(User.Roles.Admin), function(req, res) {
    UserRepo.add(req.body, function(jsonData) {
        res.json(200, jsonData);
    }, function(error) {
        res.send(500, error);
    });
});

app.get('/users/:userId', authRequired, restrictedToRole(User.Roles.Admin), function(req, res) {
    UserRepo.getById(function(jsonData) {
        res.json(200, jsonData);
    }, function(error) {
        res.send(500, error);
    });
});

app.get('/users', authRequired, restrictedToRole(User.Roles.Admin), function(req, res) {
    UserRepo.list(function(jsonData) {
        res.json(200, jsonData);
    }, function(error) {
        res.send(500, error);
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
