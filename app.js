"use strict";
const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const EnvSettings_1 = require("./config/EnvSettings");
const router = require("./routes/index");
var app = express();
exports.app = app;
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = (env === 'development');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.engine('handlebars', exphbs({
    layoutsDir: EnvSettings_1.settings.root + '/views/layouts/',
    defaultLayout: EnvSettings_1.settings.layoutFile,
    partialsDir: [EnvSettings_1.settings.root + '/views/partials/']
}));
app.set('views', EnvSettings_1.settings.root + '/views');
app.set('view engine', 'handlebars');
app.use(favicon(EnvSettings_1.settings.root + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
if (EnvSettings_1.settings.localMode === true) {
    app.use('/resources', express.static(EnvSettings_1.settings.localRoot + 'notes/resources'));
}
else {
    app.get(/^\/resources\/.+/i, function (req, res) {
        var remoteReq = EnvSettings_1.settings.remoteRoot + req.url;
        res.redirect(301, remoteReq);
    });
}
app.use(express.static(EnvSettings_1.settings.root + '/public'));
app.use('/', router.router);
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error',
            cssTheme: EnvSettings_1.settings.markdownCssFile
        });
    });
}
app.use((err, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error',
        cssTheme: EnvSettings_1.settings.markdownCssFile
    });
    return null;
});
//# sourceMappingURL=app.js.map