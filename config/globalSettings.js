"use strict";
const path = require('path');
exports.APP_NAME = 'nodtes';
exports.APP_ROOT = path.normalize(__dirname + '/..');
exports.APP_PORT = process.env.PORT || 3000;
exports.REMOTE_ROOT = 'https://raw.githubusercontent.com/skijit/notes/master/';
exports.ENV_NAME = process.env.NODE_ENV || 'development';
//# sourceMappingURL=GlobalSettings.js.map