import * as fs from "fs";
import * as path from "path";
import SiteDirectoryReader from './SiteDirectoryReader';
import DirTree from './DirTree';


class FSDirectoryReader extends SiteDirectoryReader {

  
  constructor(private localRoot : string, _url : string, delimeter : string ) { super(_url, delimeter); }


  private walkDir(dir : string, fileList : string[], removeRoot : string) : string[] {
    //TODO: Convert to Async FS API
    
    if( dir[dir.length-1] != '/') dir=dir.concat('/')

    removeRoot = removeRoot || dir;

    var files = fs.readdirSync(dir);
    fileList = fileList || [];
    
    for(var i = 0; i < files.length; i++) {
        var file = files[i];
        
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            fileList = this.walkDir(path.join(dir, file) + '/', fileList, removeRoot);
        }
        else {
            if (file.match(/\.md$/i)) {
                fileList.push(path.relative(removeRoot, path.join(dir, file)));
            }
        }
    } 
    
    return fileList;
  } 


  async fill() {
    if (this.flatList === undefined && this.dirTree === undefined) {
      this.flatList = this.walkDir(this.localRoot.replace(/\/$/,'') + '/notes', undefined, undefined)
                      .concat(
                        this.walkDir(this.localRoot.replace(/\/$/,'') + '/journal', undefined, undefined)
                        .map(x => 'journal'+this.delimiter+x)
                      );
      this.parseDirectory();
    }
  }

}

export default FSDirectoryReader;

