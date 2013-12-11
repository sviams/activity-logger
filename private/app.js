
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
var Project = require('./model/project');
var Activity = require('./model/activity');
var TimeReg = require('./model/timereg');
var TimeRegRepo = require('./model/timeRegRepo');
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



// set up passport
passport.use(new LocalStrategy(function(username, password, done) {
    UserRepo.find(function(user) {
        console.log("Found user: ");
        console.log(user);
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
    }, {username: username});
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    UserRepo.getById(function(user) {
        done(undefined, user);
    }, function(err) {
        done(err, undefined);
    }, id);
});

var authFunction = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


// Seed the database with default data

UserRepo.deleteAll(function() {
    UserRepo.seedUser(new User(undefined, 'admin', 'changeme', 'System', 'Admin', 'admin@invalid', User.Roles.Admin));
    UserRepo.seedUser(new User(undefined, 'jimmy', 'changeme', 'Jimmy', 'Nilsson', 'jimmy@factor10.com', User.Roles.Manager));
    UserRepo.seedUser(new User(undefined, 'anders', 'changeme', 'Anders', 'Jändel', 'anders@factor10.com', User.Roles.Consultant));
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

function logoutFunction(req, res){
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
}

app.get('/login', routes.login);
app.get('/', authRequired, restrictedToRole(User.Roles.Consultant), routes.index);
app.get('/admin', authRequired, restrictedToRole(User.Roles.Admin),routes.admin);
app.get('/time', authRequired, restrictedToRole(User.Roles.Consultant),routes.time);
app.get('/modal/projectpicker', authRequired, restrictedToRole(User.Roles.Consultant),routes.project_picker);
app.post('/login', authFunction);
app.get('/logout', logoutFunction);



// Reconstitute user object if possible
function parseUser(req, res, next) { User.Parse(req.body, next); }
function parseTimeReg(req, res, next) { TimeReg.Parse(req.body, next); }
function parseActivity(req, res, next) { Activity.Parse(req.body, next); }

function execJsonRequest(jsonFunction) {
    return function (req, res) {
        jsonFunction(function(jsonData) {
            res.json(200, jsonData);
        }, function(error) {
            res.send(500, error);
        }, req.body);
    };
}

var activities1 = []
activities1.push(new Activity("Analysis", "Spend some time thinking before doing", false));
activities1.push(new Activity("Design", "Translate theory into abstract design", true));
activities1.push(new Activity("Development", "Turn design into reality, and redesign accordingly", true));
activities1.push(new Activity("Test", "Find out how much time you've lost", true));

var project1 = new Project("Waterfall", "Dinosaur Inc", activities1);

var activities2 = []
activities2.push(new Activity("Prototype", "More hockey, less talking", true));
activities2.push(new Activity("Refactor", "Turn hockey into ice skating", true));
activities2.push(new Activity("Test", "Lots of auto testing here", true));


var project2 = new Project("Agile", "Hipster LLC", activities2);

function execProjectGet() {
    return function (req, res) {
        res.json(200, project1);
    };
}

function execProjectList() {
    return function (req, res) {
        res.json(200, [project1, project2]);
    };
}

app.post('/users/:userId', authRequired, restrictedToRole(User.Roles.Admin), parseUser, execJsonRequest(UserRepo.update));
app.post('/users',         authRequired, restrictedToRole(User.Roles.Admin), parseUser, execJsonRequest(UserRepo.add));
app.get('/users/:userId',  authRequired, restrictedToRole(User.Roles.Admin), parseUser, execJsonRequest(UserRepo.getById));
app.get('/users',          authRequired, restrictedToRole(User.Roles.Admin), execJsonRequest(UserRepo.list));

app.get('/project/:projectId',      authRequired, restrictedToRole(User.Roles.Consultant), execProjectGet());
app.get('/project',                 authRequired, restrictedToRole(User.Roles.Consultant), execProjectList());

app.post('/timereg/:regId',  authRequired, restrictedToRole(User.Roles.Consultant), parseTimeReg, execJsonRequest(TimeRegRepo.update));
app.post('/timereg',         authRequired, restrictedToRole(User.Roles.Consultant), parseTimeReg, execJsonRequest(TimeRegRepo.add));
app.get('/timereg/:regId',   authRequired, restrictedToRole(User.Roles.Consultant), parseTimeReg, execJsonRequest(TimeRegRepo.getById));
app.get('/timereg',          authRequired, restrictedToRole(User.Roles.Consultant), execJsonRequest(TimeRegRepo.list));


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
