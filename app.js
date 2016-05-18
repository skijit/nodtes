

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var config = require('./config/config');

var routes = require('./routes/index');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

//ignore HTTPS errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// view engine setup

app.engine('handlebars', exphbs({
  layoutsDir: config.root + '/views/layouts/',
  defaultLayout: config.layoutFile,
  partialsDir: [config.root +'/views/partials/']
}));
app.set('views', config.root + '/views'); 
app.set('view engine', 'handlebars');

app.use(favicon(config.root + '/public/img/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

//Resources can be returned locally (via static) or remotely (via redirect)
if (config.useLocalMode === true) {
    app.use('/Resources', express.static(config.localRoot+'/Resources'));
} else {
    app.get(/^\/Resources\/.+/i, function(req, res) {
        var remoteReq = config.remoteRoot + req.url;
        res.redirect(301, remoteReq);
    });
}

app.use(express.static(config.root + '/public'));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
