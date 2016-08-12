export class EnvConfig {
    
    name: string;
    layoutFile: string;
    localMode: boolean;
    markdownCssFile: string;
    localRoot: string;
    
    constructor(obj : ILocalConfig) {
        this.name = obj.name;
        this.layoutFile = obj.layoutFile;
        this.localMode = obj.localMode;
        this.markdownCssFile = obj.markdownCssFile;
        this.localRoot = obj.localRoot;
    }
    
    get root(): string {
        return globals.APP_ROOT;
    }
    get port(): number {
        return globals.APP_PORT;
    }
    get app(): IAppName {
        return { name : globals.APP_NAME };
    }
    get remoteRoot() : string {
        return globals.REMOTE_ROOT;
    }
    
}


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

/* ------------------------------------ */
import * as globals from './globalSettings';
import * as path from 'path';

export var settings = undefined;
for(let curEnv of configs) {
    if (curEnv.name === globals.ENV_NAME)
        settings = curEnv;
}


export interface IAppName {
    name: string;
}

export interface ILocalConfig {
    name: string;
    layoutFile: string;
    localMode: boolean;
    markdownCssFile: string;
    localRoot: string;
}



