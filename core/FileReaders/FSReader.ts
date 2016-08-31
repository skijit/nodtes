import * as fs from "fs";
import IFileDataReader from './IFileDataReader';


class FSReader implements IFileDataReader {
  
  constructor(private fileNames: string[]) {
    this.body = '';
  }
  
  private body : string;
  
  private readFileAsync(fileName) : Promise<string> {
    return new Promise<string>(
      (resolve, reject) => {
          fs.readFile(fileName, "utf-8", 
            (err, data) => {
                if (err) reject(`error reading filename ${fileName} : \r\n ${JSON.stringify(err)}`);
                else resolve(data);
            } 
          );
      }  
    );
  }
  
  private async _readFile() {
    this.body  = '';
    
    let i : number = 0;
    
    for (i = 0; i < this.fileNames.length; i++) {
       try { 
         this.body = await this.readFileAsync(this.fileNames[i]); 
        } catch(err) {
          //rethrow if last filename attempted
          if (i+1 === this.fileNames.length) {
            throw err;
          }
        }
        if (this.body !== '') { break; }
    }
    return;
  } 
  
  async readFile() : Promise<string[]> {
    await this._readFile();
    return this.body.split(/\r?\n/);
  }
  
}

export default FSReader;


