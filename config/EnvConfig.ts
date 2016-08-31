import * as globals from './GlobalSettings';

export class EnvConfig {
    
    name: string;
    layoutFile: string;
    localMode: boolean;
    localRoot: string;
    
    constructor(obj : ILocalConfig) {
        this.name = obj.name;
        this.layoutFile = obj.layoutFile;
        this.localMode = obj.localMode;
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
    get gitHubAPIBaseUrl() : string {
      return globals.GITHUB_API_BASE_URL;
    }
    get gitHubAPIUserAgent() : string {
      return globals.GITHUB_API_USER_AGENT;
    }
    get appRepoUrl() : string {
      return globals.APP_REPO_URL;
    }
    get contentRepoUrl() : string {
      return globals.CONTENT_REPO_URL;
    }
    
    
}

export interface ILocalConfig {
    name: string;
    layoutFile: string;
    localMode: boolean;    
    localRoot: string;
}

export interface IAppName {
     name: string;
}

