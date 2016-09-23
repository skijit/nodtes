import * as marked from 'marked';
import IFileDataReader from './FileReaders/IFileDataReader';
import FileSegment from './FileSegment';
import MarkDown from './MarkDown';

export default class MdFile {
  
    content : string[] = [];
    renderedContent : string = '';
    title: string = '';
    fileName: string = '';
    breadCrumb: string[] = [];
    fileHierarchy: FileSegment[] = [];
    renderedManifest: string = '';
  
    constructor(private reader : IFileDataReader, private url) { }
    
    async process() {
      if (this.content.length === 0) {
        this.content = await this.reader.readFile();
        this.extractFileName();
        this.extractTitle();
        this.extractBreadcrumb();
        this.extractFileHierarchy();
        this.insertClosingHeader();
        this.processManifest();
        this.renderedContent =  new MarkDown(this.fileHierarchy)
                                    .process(this.content.join("\r\n"));
      }
    }
    
    processManifest() {
      let firstHeaderLine : number = -1;
      if (this.fileHierarchy.length > 0) {
        firstHeaderLine = this.fileHierarchy[0].lineNumber;
      } else {
        //if there are no headers, then the content can't have a manifest
        this.renderedManifest = '';
        return;
      }
      
      //copy manifest contents
      let rawManifest = this.content.slice(0, firstHeaderLine-1).join('\r\n');
      
      //remove manifest contents from this.content
      for(let i = 0; i < firstHeaderLine-1; i++) {
          this.content[i] = '';
      }
      
      //compile manifest and assign to this.renderedManifest
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true, 
        smartLists: true,
        smartypants: false
      });

      let rendered = marked(rawManifest).trim();
      if (rendered) {
        //wrap in panel divs
        this.renderedManifest = `<div id='manifest-panel' class='card-panel'> ${ rendered } </div>`;
      }
    }
    
    
    extractFileName() {
      let filePath =  this.url.split('/').filter(function(n){ return n !== undefined && n !== '' });
      this.fileName = filePath[filePath.length-1].toLowerCase();
    }
    
    
    extractTitle() {
      for(let i = 1; i < this.content.length; i++) {
          if (this.content[i].match(/^\=+\s*$/)) {
              this.title = this.content[i-1];
              this.content[i-1] = '';
              this.content[i] = '';
          }
      }
    } 
    
    
    extractBreadcrumb() {
      this.breadCrumb = this.url.split('/');
      if (this.breadCrumb[0] === '') { this.breadCrumb = this.breadCrumb.slice(1); }
    }
    
    
    extractFileHierarchy() {
      this.fileHierarchy = [];
      
      let curSec : FileSegment = undefined,
          stack : FileSegment[] = [],
          headerCtr: number = 0;
          
      for(var i = 0; i < this.content.length; i++) {
          let t = this.content[i].match(/^\s*(\#+)\s{1}(.+)\s*$/i);
          if (t != null) {
            
            curSec = {
                title: t[2].trim(),
                level: t[1].length-1,
                parents: [],
                headerNumber: ++headerCtr,
                lineNumber: i + 1,
                fullPath: '',
                linkableTitle: '',
                linkablePath: ''
            }
            
            let curTop = (stack.length > 0) ? stack[stack.length-1] : null;
            
            if (curTop === null) {
                stack.push(curSec);
            } else if (curTop.level < curSec.level) {
                curSec.parents = curSec.parents.concat(curTop.parents);
                curSec.parents.push(curTop.linkablePath);
                stack.push(curSec);
            } else if (curTop.level === curSec.level) {
                curSec.parents = curSec.parents.concat(curTop.parents);
                stack.pop();
                stack.push(curSec);
            } else {
                while(stack.length !== 0 && stack[stack.length-1].level >= curSec.level) {
                    stack.pop();
                }
                stack.push(curSec);
            }
            
            curSec.fullPath = curSec.parents.length === 0 ? curSec.title : curSec.parents.join('//') + '//' + curSec.title;
            //was toLowerCase()'ing both of these, but removed
            curSec.linkableTitle = curSec.title.replace(/[^\w]+/g, '-');
            curSec.linkablePath = curSec.fullPath.replace(/[^\w]+/g, '-');
            
            this.fileHierarchy.push(curSec);
          }
      }
           
    }
    
    
    insertClosingHeader() {
        
        let lastHeaderLine : number = (this.fileHierarchy.length > 0) ? this.fileHierarchy[this.fileHierarchy.length-1].lineNumber : this.content.length-1,
            insertedCloser : boolean = false;
      
        for (var i = lastHeaderLine; i < this.content.length && !insertedCloser; i++) {
            if (this.content[i].match(/^\-{2,}\s*$/)) {
                this.content[i] = "# EOContent\r\n" + this.content[i];
                insertedCloser = true;
            } else if (i === this.content.length-1) {
                this.content[i] = this.content[i] + "\r\n# EOContent";
                insertedCloser = true;
            }
        }
    }
  
}