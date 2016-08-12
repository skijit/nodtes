import { IFileDataReader } from './IFileDataReader';
import { WebReader } from './WebReader';
import { FSReader } from './FSReader';

export default class MdFile {
  //  inject: settings
  //       properties: 
  //           fdr: FileDataReader
  //           sdr: SiteDirectoryReader
  //           fileHierarchy: string[]
  //           breadcrumb: string[]
  //           title: []
  //           markdown: string
            
  //       method:
  //           ExtractTitle()
  //           ExtractBreadcrumb()
  //           ExtractFileHierarchy()
  //           ExtractSiteDirectory()
  //           InsertClosingHeader()
            
        
  //       Process()
  
    constructor(bLocal: boolean, path: string) {
      
    } 
  
    content : string;
    title: string;
    breadcrumb: string;
    fileHierarchy: string[];
    
  
  IFileDataReader
}