import DirTree from './DirTree';

abstract class SiteDirectoryReader {
  
  dirTree : DirTree;
  flatList: string[];
  url : string; 
  curUrlIsDirectory : boolean;
  
  constructor(_url: string, public delimiter : string) {
    this.url = _url;
    this.dirTree = undefined;
    this.flatList = undefined;
    this.curUrlIsDirectory = this.url == '/';
  }
  
  
  abstract async fill();
  //abstract getDirectory() : Promise<DirTree>;
  
  
  protected parseDirectory() {
    
    let curPtr : DirTree;
    this.dirTree =  { path: '/',
                      dirName: '/',
                      files: [],
                      level: 0,
                      activePath: true,
                      reqUrl: this.url
                    } as DirTree;
    
    for(var i = 0; i < this.flatList.length; i++) {

        curPtr = this.dirTree;
        var segments = this.flatList[i].split(this.delimiter);
        for(var j = 0; j < segments.length; j++) {
            if (j === segments.length-1 && segments[j].match(/\.md$/i)) {
                curPtr.files.push(segments[j].substring(0, segments[j].length-3));
            } else if (!curPtr.hasOwnProperty(segments[j])) {
                let urlSegments = this.url.substring(1).split('/');
                curPtr[segments[j]] =   {   dirName: segments[j],
                                            path: '/' + segments.slice(0,j+1).join('/'),
                                            files: [],
                                            level: j + 1,
                                            activePath: j < urlSegments.length && segments[j].toLowerCase() === urlSegments[j].toLowerCase(),
                                            reqUrl: this.url
                                        }   as DirTree;
                if (curPtr[segments[j]].path.toLowerCase().replace(/\/?$/, '/') == this.url.toLowerCase().replace(/\/?$/, '/')) {
                    this.curUrlIsDirectory = true;
                }
            }
            curPtr = curPtr[segments[j]];
        }
    }
    
    
  }
  
}

export default SiteDirectoryReader;
