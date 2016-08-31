import { EnvConfig } from "../config/EnvSettings";
import SiteDirectoryReader from './DirectoryReaders/SiteDirectoryReader';
import GitHubWebDirectoryReader from './DirectoryReaders/GitHubWebDirectoryReader';
import FSDirectoryReader from './DirectoryReaders/FSDirectoryReader';
import IFileDataReader from './FileReaders/IFileDataReader';
import GitHubWebReader from './FileReaders/GitHubWebReader';
import FSReader from './FileReaders/FSReader';

export default class ResourceResolver {
  
  constructor(private settings : EnvConfig, private url) { 
    this.paths = [];
    this.paths = this.getPaths();
  }
  
  paths : string[];
      
  getPaths() : string[] {
    let rv : string[] = [];
    
    if (this.settings.localMode) {
        if (this.url.match(/^\/journal\//)) {
            rv.push(this.settings.localRoot.replace(/\/$/,'') + this.url + '.md');
            rv.push(this.settings.localRoot.replace(/\/$/,'') + this.url.replace(/\/$/,'') + '/index.md');
        } else {
            rv.push(this.settings.localRoot.replace(/\/$/,'') + '/notes' + this.url + '.md');
            rv.push(this.settings.localRoot.replace(/\/$/,'') + '/notes' + this.url.replace(/\/$/,'') + '/index.md');
        }
    } else {
        rv.push(this.settings.remoteRoot + this.url.replace(/\/$/,'') + '.md');
        rv.push(this.settings.remoteRoot + this.url.replace(/\/$/,'') + '/index.md');
    }
    
    return rv;
    
  }
  
  
  getFileReader() : IFileDataReader {
    if (this.settings.localMode) {
      return new FSReader(this.paths);
    } else {
      return new GitHubWebReader(this.paths);
    }
  }
  
  
  getSiteDirectoryReader() : SiteDirectoryReader {
    let delimeter = this.settings.isRunningOnMac ? '/' : '\\';
    if (this.settings.localMode) {
      return new FSDirectoryReader(this.settings.localRoot, this.url, delimeter);
    } else {
      return new GitHubWebDirectoryReader(this.settings.gitHubAPIBaseUrl, this.settings.gitHubAPIUserAgent, this.url, delimeter);
    }
  }
  
  
}