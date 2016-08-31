"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const express = require("express");
const EnvSettings_1 = require("../config/EnvSettings");
const MdFile_1 = require('../core/MdFile');
const ResourceResolver_1 = require("../core/ResourceResolver");
let pjson = require('../package.json');
let router = express.Router();
exports.router = router;
router.get('/', function (req, res) {
    res.render('index', { title: 'Contents', content: '<div>Content Page: Injected HTML</div>' });
});
router.get(/\/.+/, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let err, rr, mdFile, sdr;
        try {
            rr = new ResourceResolver_1.default(EnvSettings_1.settings, req.url);
            mdFile = new MdFile_1.default(rr.getFileReader(), req.url);
            yield mdFile.process();
            sdr = rr.getSiteDirectoryReader();
            yield sdr.fill();
            console.log('yo');
        }
        catch (_err) {
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
                appRepoUrl: EnvSettings_1.settings.appRepoUrl,
                contentRepoUrl: EnvSettings_1.settings.contentRepoUrl,
                version: pjson.version
            });
        }
    });
});
