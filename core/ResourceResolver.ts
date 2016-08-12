import { EnvConfig } from "../config/EnvSettings";

export default class ResourceResolver {
  
  constructor(private _settings : EnvConfig) { }
      
  GetPaths(url) : string[] {
    let rv : string[] = [];
    
    if (_settings.localMode) {
        if (url.match(/^\/journal\//)) {
            rv.push(_settings.localRoot.replace(/\/$/,'') + req.url + '.md');
            rv.push(_settings.localRoot.replace(/\/$/,'') + req.url.replace(/\/$/,'') + '/index.md');
        } else {
            rv.push(_settings.localRoot.replace(/\/$/,'') + '/notes' + req.url + '.md');
            rv.push(_settings.localRoot.replace(/\/$/,'') + '/notes' + req.url.replace(/\/$/,'') + '/index.md');
        }
    } else {
        rv.push(_settings.remoteRoot + req.url.replace(/\/$/,'') + '.md');
        rv.push(_settings.remoteRoot + req.url.replace(/\/$/,'') + '/index.md');
    }
    
    return rv;
    
  }
  
  
  
}