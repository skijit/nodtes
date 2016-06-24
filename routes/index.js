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
        var fileName = '';
        if (req.url.match(/^\/journal\//)) {
            fileName = config.localRoot.replace(/\/$/,'') + req.url + '.md';
        } else {
            fileName = config.localRoot.replace(/\/$/,'') + '/notes' + req.url + '.md';
        }
         
        var mdFileData = '';
        var bMDFileExists = true;
        try {
            mdFileData = fs.readFileSync(fileName, "utf-8");
        } catch (e) {
          bMDFileExists = false;
        }
        if (!bMDFileExists) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            res.render('index', {   content: markdown.process(mdFileData), 
                                    title: extractTitleFromRequest(req.url), 
                                    cssTheme: config.markdownCssFile});
        }
    } else {
        var fileName = config.remoteRoot + req.url + '.md';
        request(fileName, function (error, response, body) {
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

function extractTitleFromRequest(url) {
    var filePath =  url.split('/').filter(function(n){ return n !== undefined && n !== '' });
    return filePath[filePath.length-1].toLowerCase();
}

module.exports = router;
