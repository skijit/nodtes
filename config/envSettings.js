"use strict";
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
let configs = [
    new EnvConfig({ name: 'development',
        layoutFile: 'main',
        localMode: true,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: 'C:/GitWorkspace/'
    }),
    new EnvConfig({
        name: 'development_mac',
        layoutFile: 'main',
        localMode: true,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: '/Users/tomskjei/Documents/GitWorkspace/'
    }),
    new EnvConfig({
        name: 'test',
        layoutFile: 'main',
        localMode: false,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: 'C:/GitWorkspace/'
    }),
    new EnvConfig({
        name: 'production',
        layoutFile: 'main',
        localMode: false,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: 'C:/GitWorkspace/'
    })
];
const globals = require('./globalSettings');
exports.settings = undefined;
for (let curEnv of configs) {
    if (curEnv.name === globals.ENV_NAME)
        exports.settings = curEnv;
}
//# sourceMappingURL=envSettings.js.map