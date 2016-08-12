import * as marked from 'marked';
import * as highlightjs from 'highlight.js';

var markdown = markdown || {};

//update marked renderer to support hash-links on headings (like on github)
markdown.renderer = new marked.Renderer();

markdown.renderer.heading = function (text, level) {
    var bFirstHeader = (level === 1 && text !== "EOContent"),
        bLastHeader = (level === 1 && text === "EOContent"),
        bIntermediateHeader = !(bFirstHeader && bLastHeader);
    
    //markdown.clientData.fileHierarchy
    //TODO:
    //leadingCloseDiv
    //content
    //if first, no leadingCloseDiv
    //if last, no content
    //if intermediate, yes leadingCloseDiv AND content
    
    
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText + '">' +
        text + '</a></h' + level + '>';
};

markdown.renderer.code = function(code, language)  {
    if (language) { language = language.replace(/[()]/g,''); }
    // Check whether the given language is valid for highlight.js.
    const validLang = !!(language && highlightjs.getLanguage(language));
    // Highlight only if the language is valid.
    const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
    // Render the highlighted code with `hljs` class.
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

markdown.process = function(mdTxt, fileHierarchy) {

    markdown.clientData = {
        fileHierarchy : fileHierarchy
    };

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
    
    return marked(mdTxt);

}

export { markdown } ;
