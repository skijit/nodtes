"use strict";
const globals = require('./GlobalSettings');
class EnvConfig {
    constructor(obj) {
        this.name = obj.name;
        this.layoutFile = obj.layoutFile;
        this.localMode = obj.localMode;
        this.markdownCssFile = obj.markdownCssFile;
        this.localRoot = obj.localRoot;
    }
    get root() {
        return globals.APP_ROOT;
    }
    get port() {
        return globals.APP_PORT;
    }
    get app() {
        return { name: globals.APP_NAME };
    }
    get remoteRoot() {
        return globals.REMOTE_ROOT;
    }
}
exports.EnvConfig = EnvConfig;
//# sourceMappingURL=EnvConfig.js.map