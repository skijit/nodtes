import * as express from "express";
import { settings, EnvConfig } from "../config/EnvSettings";
import MdFile from '../core/MdFile';
import ResourceResolver from "../core/ResourceResolver";
import SiteDirectoryReader from "../core/DirectoryReaders/SiteDirectoryReader";
import DirTree from '../core/DirectoryReaders/DirTree';
import DirectoryContents from '../core/DirectoryContents';
let pjson = require('../package.json');

let router = express.Router();

//main content files route
router.get(/.*/, async function(req, res, next) {
    let err : any,
        rr : ResourceResolver,
        mdFile : MdFile,
        sdr : SiteDirectoryReader,
        dirContents: DirectoryContents;

    try {
        rr = new ResourceResolver(settings, req.url);
        
        //TODO: make these two awaited methods return promises and then use Promise.All()
        sdr = rr.getSiteDirectoryReader();
        await sdr.fill();

        if (!sdr.curUrlIsDirectory) {
            mdFile = new MdFile(rr.getFileReader(), req.url);
            await mdFile.process();
        } else {
            dirContents = new DirectoryContents(sdr.url, sdr.dirTree);
            dirContents.process();
        }
                        
    } catch(_err) {
        console.log(_err);
        err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    }
    
    if (!err) {
        if (!sdr.curUrlIsDirectory) {
            res.render('mdFile', {
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
        } else {
            res.render('directory', {
                manifest: '',
                title: sdr.url,
                dirContents: dirContents,
                breadCrumb: sdr.url.trim().replace(/^\//,"").replace(/\/$/,"").split('/'),
                fileHierarchy: [], 
                siteDirectory: sdr.dirTree, 
                appRepoUrl: settings.appRepoUrl,
                contentRepoUrl: settings.contentRepoUrl,
                version: pjson.version,
                localMode: settings.localMode
            });
        }
    }
});


export { router } ;
