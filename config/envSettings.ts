import  { EnvConfig, ILocalConfig } from './EnvConfig';
import * as globals from './GlobalSettings';

let configs: EnvConfig[] = [
    new EnvConfig(
        <ILocalConfig>  {   name: 'development', 
                            layoutFile: 'main',
                            localMode: true,
                            markdownCssFile: 'vs-code-theme/combined.css',
                            localRoot: 'C:/GitWorkspace/'
                        } 
    ),
    new EnvConfig(
        <ILocalConfig>  {
                            name: 'development_mac',
                            layoutFile: 'main',
                            localMode: true,
                            markdownCssFile: 'vs-code-theme/combined.css',
                            localRoot: '/Users/tomskjei/Documents/GitWorkspace/'
                        }),
    new EnvConfig(
        <ILocalConfig>  {
                            name: 'test',
                            layoutFile: 'main',
                            localMode: false,
                            markdownCssFile: 'vs-code-theme/combined.css',
                            localRoot: 'C:/GitWorkspace/'
                        }),
    new EnvConfig(
        <ILocalConfig>  {
                            name: 'production',
                            layoutFile: 'main',
                            localMode: false,
                            markdownCssFile: 'vs-code-theme/combined.css',
                            localRoot: 'C:/GitWorkspace/'
                        })
];

export var settings : EnvConfig = undefined;

for(let curEnv of configs) {
    if (curEnv.name === globals.ENV_NAME)
        settings = curEnv;
}

export { EnvConfig } from './EnvConfig';