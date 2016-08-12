import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as request from "request";

import { settings, EnvConfig } from "../config/EnvSettings";
import { MdFile } from '../core/MdFile';
import { ReadSiteDirectory } from '../core/ReadSiteDirectory';
import { markdown } from "../markdown";



let router = express.Router();

function errorWrapper(next) {
    
}

//TODO: A Dynamic Home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Contents', content: '<div>Content Page: Injected HTML</div>' });
});


//main content files route
router.get(/\/.+/, function(req, res, next) {
    let err;
    
    try {
        let rr = new ResourceResolver(settings);
        let mdFile : MdFile = new MdFile(/* PARMS TODO */);
        let siteDirectory : string[] = ReadSiteDirectory(/* PARMS TODO */);
        
    } catch(_err) {
        console.log(_err);
        err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    }
    
    if (!err) {
        res.render('index', {
            content: mdFile.content,
            title: mdFile.title,
            breadcrumb: mdFile.breadcrumb,
            fileHierarchy: mdFile.fileHierarchy, 
            siteDirectory: siteDirectory,
            cssTheme: settings.markdownCssFile
        });
    }

});


function extractTitleFromRequest(url) {
    var filePath =  url.split('/').filter(function(n){ return n !== undefined && n !== '' });
    return filePath[filePath.length-1].toLowerCase();
}



//function walkSync(dir, filelist = undefined, removeRoot  = undefined) {
function walkSync(dir, filelist, removeRoot) {
    
    if( dir[dir.length-1] != '/') dir=dir.concat('/')

    removeRoot = removeRoot || dir;

    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    
    for(var i = 0; i < files.length; i++) {
        var file = files[i];
        
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file) + '/', filelist, removeRoot);
        }
        else {
            if (file.match(/\.md$/i)) {
                filelist.push(path.relative(removeRoot, path.join(dir, file)));
            }
        }
    }
    
    return filelist;
};

function getRepoTreeAsync(sha: string) {
    var options = {
            url: 'https://api.github.com/repos/skijit/notes/git/trees/' + sha +'?recursive=1',
            headers: {
                'User-Agent': 'nodtes-skijit'
            }
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

async function getRepoTree(sha : string, next : any) {
    try {
        let results : any = JSON.parse(await getRepoTreeAsync(sha));
        let contents : string[] = [];
        if (!results.truncated) {
            for(var i = 0; i < results.tree.length; i++) {
                if (results.tree[i].path.match(/\.md$/i)) {
                    contents.push(results.tree[i].path);
                }
            }
            console.log('REPO TREE CONTENTS!')
            console.log(contents);
        } else {
            throw new Error("error: git repo tree results were truncated.");
        }
    } catch(err) {
        console.log(err);
        errorWrapper(next);
    }
    
}

function getShaAsync() {
    let lastCommitSha : string = '',
        options = {
            //TODO: To avoid rate limits, consider authenticating
            //https://developer.github.com/v3/#rate-limiting
            //TODO: Even better, cache this shit
            url: 'https://api.github.com/repos/skijit/notes/commits?sha=master&per_page=1',
            headers: {
                'User-Agent': 'nodtes-skijit'
            }
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

async function getSha(next) {
    try {
        let lastCommitSha = JSON.parse(await getShaAsync())[0].sha;
        getRepoTree(lastCommitSha, next);
    } catch (err) {
        console.log(err);
        errorWrapper(next);
    }    
}

function getSiteDirectory(next) {
    //add local and remote parsing to get site directory into an object structure
    
    if (settings.localMode) {
        //var dirList = walkSync(config.settings.localRoot.replace(/\/$/,'') + '/notes');
        var dirList = walkSync(settings.localRoot.replace(/\/$/,'') + '/notes', undefined, undefined);
        var dirTree = parseDirectory(dirList,'\\');
        return dirTree;
    } else {
        getSha(next);
    }
}

function parseDirectory(vals, delimiter) {
    
    var curPtr,
        rv = { 
                path: '/',
                files: []
            };
    
    for(var i = 0; i < vals.length; i++) {
        curPtr = rv;
        var segments = vals[i].split(delimiter);
        for(var j = 0; j < segments.length; j++) {
            if (j === segments.length-1 && segments[j].match(/\.md$/i)) {
                curPtr.files.push(segments[j].substring(0, segments[j].length-3));
            } else if (!curPtr.hasOwnProperty(segments[j])) {
                curPtr[segments[j]] =   { 
                                            path: segments[j],
                                            files: []
                                        }
            }
            curPtr = curPtr[segments[j]];
        }
    }
    
    return rv;
}

function extractBreadCrumb(url) {
    return url.split('/');
}

function buildFileHierarchy(lines) {
    var docSegments = [];
    var curSec;
    var stack = [];
    var headerCtr = 0;
    for(var i = 0; i < lines.length; i++) {
        var t = lines[i].match(/^(\#+)\s{1}(.+)$/i);
        if (t != null) {
            console.log(t[1] + ' ---- ' + t[2]);
            curSec = {
                title: t[2],
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
                curSec.parents.push(curTop.title);
                stack.push(curSec);
            } else if (curTop.level === curSec.level) {
                curSec.parents = curSec.parents.concat(curTop.parents);
                stack.pop();
                stack.push(curSec);
            } else {
                while(stack.length !== 0 && stack[stack.length-1].level > curSec.level) {
                    stack.pop();
                }
            }
            curSec.fullPath = curSec.parents.length === 0 ? curSec.title : curSec.parents.join('//') + '//' + curSec.title;
            curSec.linkableTitle = curSec.title.toLowerCase().replace(/[^\w]+/g, '-');
            curSec.linkablePath = curSec.fullPath.toLowerCase().replace(/[^\w]+/g, '-');
            
            docSegments.push(curSec);
        }
        
        
        if (lines[i].match(/^\=+\s*$/)) {
            console.log('TITLE FOUND AT LINE ' + i + ': ' + lines[i-1]);
        }
    }
    
    return docSegments;
}

function insertClosingHeader(lines, fileHierarchy) {
    var lastHeaderLine = fileHierarchy[fileHierarchy.length-1].lineNumber;
    var insertedCloser = false;
    for (var i = lastHeaderLine; i < lines.length && !insertedCloser; i++) {
        
        if (lines[i].match(/^\-{2,}\s*$/)) {
            lines[i] = "# EOContent\r\n" + lines[i];
            insertedCloser = true;
        } else if (i === lines.length-1) {
            lines[i] = lines[i] + "\r\n# EoContent";
            insertedCloser = true;
        }
    }
}

function extractTitle(lines) {
    for(var i = 1; i < lines.length; i++) {
        if (lines[i].match(/^\=+\s*$/)) {
            return lines[i-1];
        }
    }
}

function packageViewData(body, url, next) {
    var dirTree = getSiteDirectory(next); //TODO: pass this in as a param
    var breadcrumb = extractBreadCrumb(url.substring(1));
    
    var lines = body.split(/\r?\n/);
    var title = extractTitle(lines);
    var fileHierarchy = buildFileHierarchy(lines);
    insertClosingHeader(lines, fileHierarchy);
    body = lines.join("\r\n");
    
    return {
        content: markdown.process(body, fileHierarchy), 
        title: extractTitleFromRequest(url), 
        cssTheme: settings.markdownCssFile 
    };
}

function getFileAsync(url) {
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

async function processRemoteMd(req, res, next) {
    let mdFileName = settings.remoteRoot + req.url.replace(/\/$/,'') + '.md',
        indexMdFileName = settings.remoteRoot + req.url.replace(/\/$/,'') + '/index.md',
        bodyMD = '',
        bodyIndex = '';
        
    try { bodyMD = await getFileAsync(mdFileName); } catch(err) { }
    try { bodyIndex = await getFileAsync(indexMdFileName); } catch(err) {}
    
    if (bodyMD || bodyIndex) {
        res.render('index', packageViewData(bodyMD ? bodyMD : bodyIndex, req.url, next));
    } else {
        errorWrapper(next);
    }
        
}

function readFileAsync(fileName) {
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

async function processLocalMd(req, res, next) {    
    let mdFileName = '', 
        indexMdFileName = '',
        bodyMD = '',
        bodyIndex = '';
        
    if (req.url.match(/^\/journal\//)) {
        mdFileName = settings.localRoot.replace(/\/$/,'') + req.url + '.md';
        indexMdFileName = settings.localRoot.replace(/\/$/,'') + req.url.replace(/\/$/,'') + '/index.md';
    } else {
        mdFileName = settings.localRoot.replace(/\/$/,'') + '/notes' + req.url + '.md';
        indexMdFileName = settings.localRoot.replace(/\/$/,'') + '/notes' + req.url.replace(/\/$/,'') + '/index.md';
    }
    
    try { bodyMD = await readFileAsync(mdFileName); } catch(err) {}
    try { bodyIndex = await readFileAsync(indexMdFileName); } catch(err) {}
    
    if (bodyMD || bodyIndex) {
        res.render('index', packageViewData(bodyMD ? bodyMD : bodyIndex, req.url, next));
    } else {
        errorWrapper(next);
    }
}

export { router} ;
//module.exports = router;
