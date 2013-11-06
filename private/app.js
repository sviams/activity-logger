
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var Users = require('./users');

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


//Users.setup(passport);

// Connect function for ensuring authorization before access
function authRequired(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}



// Connect function for ensuring that the user has the correct role
function restrictedToRole(role) {
    return function(req, res, next) {
        if (req.user.role <= role) next();
        else {
            console.log('User role is ' + req.user.role + ' and requirement is ' + role);
            next(new Error('Insufficient permissions'));
        }
    }
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/login', routes.login);
app.get('/', authRequired, restrictedToRole(Users.Role.User), routes.index);
//app.get('/users', authRequired, restrictedToRole(Users.Role.Manager), Users.list);
app.get('/admin', authRequired, restrictedToRole(Users.Role.Admin),routes.admin);
app.post('/login', Users.authFunction);
app.get('/logout', function (req, res){
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});
app.post('/users/:userId', authRequired, restrictedToRole(Users.Role.Admin), Users.update);
app.post('/users', authRequired, restrictedToRole(Users.Role.Admin), Users.post);
app.get('/users/:userId', authRequired, restrictedToRole(Users.Role.Admin), Users.get);
app.get('/users', authRequired, restrictedToRole(Users.Role.Admin), Users.list);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
