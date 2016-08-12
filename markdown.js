"use strict";
const marked = require('marked');
const highlightjs = require('highlight.js');
var markdown = markdown || {};
exports.markdown = markdown;
markdown.renderer = new marked.Renderer();
markdown.renderer.heading = function (text, level) {
    var bFirstHeader = (level === 1 && text !== "EOContent"), bLastHeader = (level === 1 && text === "EOContent"), bIntermediateHeader = !(bFirstHeader && bLastHeader);
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText + '">' +
        text + '</a></h' + level + '>';
};
markdown.renderer.code = function (code, language) {
    if (language) {
        language = language.replace(/[()]/g, '');
    }
    const validLang = !!(language && highlightjs.getLanguage(language));
    const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};
markdown.process = function (mdTxt, fileHierarchy) {
    markdown.clientData = {
        fileHierarchy: fileHierarchy
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
};
//# sourceMappingURL=markdown.js.map