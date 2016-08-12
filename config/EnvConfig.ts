import * as globals from './GlobalSettings';

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

export interface ILocalConfig {
    name: string;
    layoutFile: string;
    localMode: boolean;
    markdownCssFile: string;
    localRoot: string;
}

export interface IAppName {
     name: string;
}

