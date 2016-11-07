import DirectoryEntry from './DirectoryEntry';
import DirTree from './DirectoryReaders/DirTree';

export default class DirectoryContents {
  dirs: DirectoryEntry[];
  files: DirectoryEntry[];
  
  private dirIndex;

  constructor(private _url : string, private _dirTree: DirTree) { 
    this.dirs = [];
    this.files = [];
    this.dirIndex = {};
  }

  process() {
    this._url= this._url.trim().replace(/^\//,"").replace(/\/$/,"");
    let segments = this._url.split('/');
    let curNode : DirTree = this._dirTree;
    let isRootNode : boolean = segments.length == 1 && segments[0] ==  "";
    
    if (!isRootNode) {
      for(let i = 0; i < segments.length; i++) {
        curNode = curNode[segments[i]];
      }

      this.dirs.push({
          name: "..",
          path: segments.length == 1 ? '/' : '/'+this._url.replace(/\/[^\/]+$/,"")
        });
    }

    Object.getOwnPropertyNames(curNode).forEach(x => {
      if (x != "dirName" && x != "path" && x != "files" && x != "level" && x != "activePath" && x != "reqUrl") {
        this.dirs.push({
          name: x,
          path: isRootNode ? '/'+x.toLowerCase() : '/'+this._url+'/'+x.toLowerCase()
        });
      }
    });

    curNode.files.forEach(x => {
      let fileSegments = x.trim().split('/');
      let fileName = fileSegments[fileSegments.length-1];
      this.files.push({
        name: x,
        path: isRootNode ? '/'+x : '/'+this._url+'/'+x
      });
    });

  }
}