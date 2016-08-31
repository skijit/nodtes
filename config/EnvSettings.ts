import  { EnvConfig, ILocalConfig } from './EnvConfig';
import * as globals from './GlobalSettings';

let configs: EnvConfig[] = [
    new EnvConfig(
        <ILocalConfig>  {   name: 'development', 
                            layoutFile: 'main',
                            localMode: true,                            
                            localRoot: 'C:/GitWorkspace/',
                            isRunningOnMac: false
                        } 
    ),
    new EnvConfig(
        <ILocalConfig>  {
                            name: 'development_mac',
                            layoutFile: 'main',
                            localMode: false,
                            localRoot: '/Users/tomskjei/Documents/GitWorkspace/',
                            isRunningOnMac: true
                        }),
    new EnvConfig(
        <ILocalConfig>  {
                            name: 'test',
                            layoutFile: 'main',
                            localMode: false,
                            localRoot: 'C:/GitWorkspace/',
                            isRunningOnMac: false
                        }),
    new EnvConfig(
        <ILocalConfig>  {
                            name: 'production',
                            layoutFile: 'main',
                            localMode: false,
                            localRoot: 'C:/GitWorkspace/',
                            isRunningOnMac: false
                        })
];

export var settings : EnvConfig = undefined;

for(let curEnv of configs) {
    if (curEnv.name === globals.ENV_NAME)
        settings = curEnv;
}

export { EnvConfig } from './EnvConfig';