import * as request from "request";
import SiteDirectoryReader from './SiteDirectoryReader';
import DirTree from './DirTree';


class GitHubWebDirectoryReader extends SiteDirectoryReader {
  
  private lastCommitSha : string = '';
    
  constructor(private baseUrl : string, private userAgent : string, _url : string, delimeter : string) { super(_url, delimeter); }
  
  
  private getShaAsync() : Promise<string> {
    let lastCommitSha : string = '',
        options = {
            //TODO: To avoid rate limits, consider authenticating
            //https://developer.github.com/v3/#rate-limiting
            //TODO: Even better, cache this!            
            url: this.baseUrl+'commits?sha=master&per_page=1',
            headers: { 'User-Agent': this.userAgent }
        };
        
        return new Promise<string>(
            (resolve, reject) => {
                request(options, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject('error getting SHA tree: \r\n' + JSON.stringify(error));
                    } 
                });
            }
        );
    
  }
  
  
  private async getRepoTree(sha : string) {
      
      let results : any = JSON.parse(await this.getRepoTreeAsync(sha));
      this.flatList = [];
      
      if (!results.truncated) {
        for(var i = 0; i < results.tree.length; i++) {
          if (results.tree[i].path.match(/\.md$/i)) {
            this.flatList.push(results.tree[i].path);
          }
        }
      } else {
        throw new Error("error: git repo tree results were truncated.");
      }
    
  }
  
  
  private getRepoTreeAsync(sha : string) : Promise<string> {
    var options = {
            url: `${this.baseUrl}git/trees/${sha}?recursive=1`,
            headers: { 'User-Agent': this.userAgent }
    };
            
    return new Promise<string>(
        (resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                } else {
                    reject('error getting repo tree: \r\n' + JSON.stringify(error));
                } 
            });
        }
    );
  }
    
  
  async fill() {
    if (this.flatList === undefined && this.dirTree === undefined) {
      this.lastCommitSha = JSON.parse(await this.getShaAsync())[0].sha;
      await this.getRepoTree(this.lastCommitSha);
      this.parseDirectory();
    }
  }
  
  
}

export default GitHubWebDirectoryReader;

