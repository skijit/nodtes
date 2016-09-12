import * as express from "express";
import { settings, EnvConfig } from "../config/EnvSettings";
import MdFile from '../core/MdFile';
import ResourceResolver from "../core/ResourceResolver";
import SiteDirectoryReader from "../core/DirectoryReaders/SiteDirectoryReader";
import DirTree from '../core/DirectoryReaders/DirTree';
let pjson = require('../package.json');

let router = express.Router();

//TODO: A Dynamic Home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Contents', content: '<div>Content Page: Injected HTML</div>' });
});

//main content files route
router.get(/\/.+/, async function(req, res, next) {
    let err : any,
        rr : ResourceResolver,
        mdFile : MdFile,
        sdr : SiteDirectoryReader;
        
    try {
        rr = new ResourceResolver(settings, req.url);
        
        //TODO: make these two awaited methods return promises and then use Promise.All()
        
        mdFile = new MdFile(rr.getFileReader(), req.url);
        await mdFile.process(); 
                
        sdr = rr.getSiteDirectoryReader();
        await sdr.fill();
                
    } catch(_err) {
        console.log(_err);
        err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    }
    
    if (!err) {
        res.render('index', {
            content: mdFile.renderedContent,
            manifest: mdFile.renderedManifest,
            title: mdFile.title,
            breadCrumb: mdFile.breadCrumb,
            fileHierarchy: mdFile.fileHierarchy, 
            siteDirectory: sdr.dirTree, 
            appRepoUrl: settings.appRepoUrl,
            contentRepoUrl: settings.contentRepoUrl,
            version: pjson.version,
            localMode: settings.localMode
        });
    }
});


export { router } ;
