/// <reference path="./_allTypings.d.ts" />

import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as exphbs from "express-handlebars";
import * as config from "./config/envSettings";
import * as router from "./routes/index";

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = (env === 'development');

//ignore HTTPS errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// view engine setup
app.engine('handlebars', exphbs({
  layoutsDir: config.settings.root + '/views/layouts/',
  defaultLayout: config.settings.layoutFile,
  partialsDir: [config.settings.root +'/views/partials/']
}));
app.set('views', config.settings.root + '/views'); 
app.set('view engine', 'handlebars');

app.use(favicon(config.settings.root + '/public/img/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

//Resources can be returned locally (via static) or remotely (via redirect)
if (config.settings.localMode === true) {
    app.use('/resources', express.static(config.settings.localRoot+'notes/resources'));
} else {
    app.get(/^\/resources\/.+/i, function(req, res) {
        var remoteReq = config.settings.remoteRoot + req.url;
        res.redirect(301, remoteReq);
    });
}

app.use(express.static(config.settings.root + '/public'));

app.use('/', router.router);

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     next(err);
// });
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err: any, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error',
      cssTheme: config.settings.markdownCssFile
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
  res.status(err['status'] || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error',
    cssTheme: config.settings.markdownCssFile
  });
  return null;
});


export { app };
