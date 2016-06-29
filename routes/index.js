var express = require('express');
var router = express.Router();
var config = require('../config/config');
var markdown = require('../markdown')
var fs = require('fs');
var request = require('request');

//TODO: A Dynamic Home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Contents', content: '<div>Content Page: Injected HTML</div>' });
});


//main content files route
router.get(/\/.+/, function(req, res, next) {
    if (config.localMode === true) {
        var mdFileName = '', indexMdFileName = '';
        if (req.url.match(/^\/journal\//)) {
            mdFileName = config.localRoot.replace(/\/$/,'') + req.url + '.md';
            indexMdFileName = config.localRoot.replace(/\/$/,'') + req.url.replace(/\/$/,'') + '/index.md';
        } else {
            mdFileName = config.localRoot.replace(/\/$/,'') + '/notes' + req.url + '.md';
            indexMdFileName = config.localRoot.replace(/\/$/,'') + '/notes' + req.url.replace(/\/$/,'') + '/index.md';
        }
        console.log(mdFileName);
        console.log(indexMdFileName);
        var mdFileData = '', indexMdFileData = '';
        var bMdFileExists = true, bIndexMdFileExists = true;
        try {
            mdFileData = fs.readFileSync(mdFileName, "utf-8");
        } catch (e) {
          bMdFileExists = false;
        }
        try {
            indexMdFileData = fs.readFileSync(indexMdFileName, "utf-8");
        } catch (e) {
            bIndexMdFileExists = false;
        }
        if (!bIndexMdFileExists && !bMdFileExists) {
            var indexFileData = '';
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
        else {
            res.render('index', {   content: markdown.process(bMdFileExists ? mdFileData : indexMdFileData), 
                                    title: extractTitleFromRequest(req.url), 
                                    cssTheme: config.markdownCssFile});
        }
    } else {
        var mdFileName = config.remoteRoot + req.url.replace(/\/$/,'') + '.md';
        var indexMdFileName = config.remoteRoot + req.url.replace(/\/$/,'') + '/index.md';
        request(mdFileName, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.render('index', {   content: markdown.process(body), 
                                        title: extractTitleFromRequest(req.url), 
                                        cssTheme: config.markdownCssFile});
            } else {
                request(indexMdFileName, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.render('index', {   content: markdown.process(body), 
                                                title: extractTitleFromRequest(req.url), 
                                                cssTheme: config.markdownCssFile});
                    } else {
                        var err = new Error('Not Found');
                        err.status = 404;
                        next(err);
                    }
                });
            }
        });
    }
});

function extractTitleFromRequest(url) {
    var filePath =  url.split('/').filter(function(n){ return n !== undefined && n !== '' });
    return filePath[filePath.length-1].toLowerCase();
}

module.exports = router;
