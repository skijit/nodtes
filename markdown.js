var marked = require('marked');
var highlightjs = require('highlight.js');

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

markdown.renderer.code = function(code, language)  {
    language = language.replace(/[()]/g,'');
    // Check whether the given language is valid for highlight.js.
    const validLang = !!(language && highlightjs.getLanguage(language));
    // Highlight only if the language is valid.
    const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
    // Render the highlighted code with `hljs` class.
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

markdown.process = function(mdTxt) {

    marked.setOptions({
        renderer: markdown.renderer,
        highlight: function (code) {
            return highlightjs.highlightAuto(code).value;
        },
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
