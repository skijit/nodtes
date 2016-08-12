"use strict";
const EnvConfig_1 = require('./EnvConfig');
const globals = require('./GlobalSettings');
let configs = [
    new EnvConfig_1.EnvConfig({ name: 'development',
        layoutFile: 'main',
        localMode: true,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: 'C:/GitWorkspace/'
    }),
    new EnvConfig_1.EnvConfig({
        name: 'development_mac',
        layoutFile: 'main',
        localMode: true,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: '/Users/tomskjei/Documents/GitWorkspace/'
    }),
    new EnvConfig_1.EnvConfig({
        name: 'test',
        layoutFile: 'main',
        localMode: false,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: 'C:/GitWorkspace/'
    }),
    new EnvConfig_1.EnvConfig({
        name: 'production',
        layoutFile: 'main',
        localMode: false,
        markdownCssFile: 'vs-code-theme/combined.css',
        localRoot: 'C:/GitWorkspace/'
    })
];
exports.settings = undefined;
for (let curEnv of configs) {
    if (curEnv.name === globals.ENV_NAME)
        exports.settings = curEnv;
}
var EnvConfig_2 = require('./EnvConfig');
exports.EnvConfig = EnvConfig_2.EnvConfig;
//# sourceMappingURL=EnvSettings.js.map