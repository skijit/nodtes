/// <reference path="./_allTypings.d.ts" />

import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as exphbs from "express-handlebars";
import { settings, EnvConfig } from "./config/EnvSettings";
import * as router from "./routes/index";
import * as helpers from "./views/helpers/helpers";

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = (env === 'development');

//ignore HTTPS errors
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// view engine setup
app.engine('handlebars', exphbs({
  layoutsDir: settings.root + '/views/layouts/',
  defaultLayout: settings.layoutFile,
  partialsDir: [settings.root +'/views/partials/'],
  helpers: {
    scrollSpy: helpers.scrollSpy,
    siteDirectory: helpers.siteDirectory,
    breadCrumb: helpers.breadCrumb,
    dirEntry: helpers.dirEntry
  },
  compilerOptions: {
    preventIndent: true
  }
}));
app.set('views', settings.root + '/views'); 
app.set('view engine', 'handlebars');

app.use(favicon(settings.root + '/public/img/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

//Resources can be returned locally (via static) or remotely (via redirect)
if (settings.localMode === true) {
    app.use('/resources', express.static(settings.localRoot+'notes/resources'));
    app.use('/mathjax', express.static(settings.localRoot+'nodtes/redist/mathjax'));
    app.use('/material-icons', express.static(settings.localRoot+'nodtes/redist/material-design-icons-3.01'));
    app.use('/fonts', express.static(settings.localRoot+'nodtes/redist/fonts'));
} else {
    app.get(/^\/resources\/.+/i, function(req, res) {
        var remoteReq = settings.remoteRoot + req.url;
        res.redirect(301, remoteReq);
    });
}

app.use(express.static(settings.root + '/public'));

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
console.log(app.get('env'));
if (app.get('env').match(/^development/)) {
  app.use((err: any, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
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
    title: 'error'
  });
  return null;
});


export { app };
