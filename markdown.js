var marked = require('marked');

var markdown = markdown || {};

//update marked renderer to support hash-links on headings (like on github)
markdown.renderer = new marked.Renderer();

markdown.renderer.heading = function (text, level) {
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText + '">' +
        text + '</a></h' + level + '>';
};

markdown.process = function(mdTxt) {

    marked.setOptions({
        renderer: markdown.renderer,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true, 
        smartLists: true,
        smartypants: false
    });
    
    //TODO: incorporate highlight.js -- see marked npmjs notes (https://www.npmjs.com/package/marked)
    //or some other method... not sure how this will work yet
    //this may be useful: https://github.com/kerzol/markdown-mathjax
    //also see: http://docs.mathjax.org/en/latest/start.html#tex-and-latex-input
    
    return marked(mdTxt);

}


module.exports = markdown;
