export default class DirTree {
  dirName: string;
  path: string;
  files: string[];
  level: number;
  activePath: boolean;
  reqUrl : string;
  
  static isPropADir(val :string) {
    return !( (val === 'dirName') ||
              (val === 'path') ||
              (val === 'files') ||
              (val === 'level') ||
              (val === 'activePath') ||
              (val === 'reqUrl')
    );
  }
}