import * as request from "request";
import IFileDataReader from './IFileDataReader';

class GitHubWebReader implements IFileDataReader {
  
  constructor(private fileNames: string[]) {
    this.body = '';
  }
  
  private body : string;
  
  private getFileAsync(url) : Promise<string> {
    return new Promise<string>(
        (resolve, reject) => {
            request(url, 
                (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(`error getting file: ${url} \r\n ${JSON.stringify(error)}`);
                    }
                }
            );
        }
    );
  }
  
  private async getFile() {
    this.body  = '';
    
    let i : number = 0;
    
    for (i = 0; i < this.fileNames.length; i++) {
       try { 
         this.body = await this.getFileAsync(this.fileNames[i]); 
        } catch(err) {
          //rethrow if last filename attempted
          if (i+1 === this.fileNames.length) {
            throw err;
          }
        }
        if (this.body !== '') { break; }
    }
  }
  
  async readFile() : Promise<string[]> {
    await this.getFile();
    return this.body.split(/\r?\n/);
  }
}


export default GitHubWebReader;

