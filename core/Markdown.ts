/// <reference path="../_allTypings.d.ts" />
import * as marked from 'marked';
import * as highlightjs from 'highlight.js';
import FileSegment from './FileSegment'

export default class MarkDown {
  
  static renderer;
  static headingCtr : number;
  static firstIntermediateHeader : boolean;
  static fileHierarchy: FileSegment[];
  
  constructor(fileHierarchy: FileSegment[]) {
    MarkDown.fileHierarchy = fileHierarchy;
    MarkDown.renderer = new marked.Renderer();
    MarkDown.renderer.heading = this.headingRenderer;
    MarkDown.renderer.code = this.codeRenderer;
    MarkDown.renderer.codespan = this.codespan;
  }
  
  private headingRenderer(text, level) {
    let bFirstHeader = (level === 1 && text !== "EOContent"),
        bLastHeader = (level === 1 && text === "EOContent"),
        bIntermediateHeader = (!bFirstHeader && !bLastHeader && level !== 1),
        content = '';
    
    if (bFirstHeader) {
      content = `<h1><a href='#${MarkDown.titleToLink(text)}'> ${text} </a></h1>`; 
    }
    else if (bIntermediateHeader) {
      let link = '',
          divOpen = '',
          indentSymbol = '',
          divClose = '</div>';
          
      for(let i = 2; i < level; i++) {
        indentSymbol += '<i class="material-icons">subdirectory_arrow_right</i>'
      }
      
      if (MarkDown.fileHierarchy[MarkDown.headingCtr].parents.length > 0) {
        divOpen = `<div id="${MarkDown.fileHierarchy[MarkDown.headingCtr].linkablePath}" 
                  class="section scrollspy markup-content" 
                  data-parent="${MarkDown.titleToLink(MarkDown.fileHierarchy[MarkDown.headingCtr].parents[0])}">`;
      } else {
        divOpen = `<div id="${MarkDown.fileHierarchy[MarkDown.headingCtr].linkablePath}" class="section scrollspy markup-content">`;
      }
      
      link =  `<h${level}>
                ${indentSymbol}
                <a href='#${MarkDown.fileHierarchy[MarkDown.headingCtr].linkablePath}'> ${text} </a> 
                <i class="section-toggle material-icons">keyboard_arrow_down</i> 
              </h${level}>`;
      
      if (MarkDown.firstIntermediateHeader) {
        MarkDown.firstIntermediateHeader = false;
        content = `${divOpen} \r\n ${link}`; 
      } 
      else {
        content = `${divClose} ${divOpen} \r\n ${link}`;
      }
      MarkDown.headingCtr++;    
    } 
    else if (bLastHeader) {
      content = '</div>'; 
    }
    
    return content;
  }
  
  private codespan(code : string) {
    if (code !== undefined && code.length > 1) {
      if (code[0] === '-' || code[0] === '+') {
        return MarkDown.texRenderer(code.slice(1), code[0] === '+');
      } else {
        return `<code class='inline-code'>${code}</code>`
      }
    } else {
      return code;
    }
  }
  
  static texRenderer(code, isBlock) {
    if (isBlock) {
      return `$$ ${code} $$`
    } else {
      return `\\( ${code} \\)`;
    }
  }
  
  private codeRenderer(code : string, language : string) {
    //branch if LaTEX block
    if (language === '-' || language === '+') {
      return MarkDown.texRenderer(code, language === '+');
    } 
    
    if (language) { language = language.replace(/[()]/g,''); }
  
    // Check whether the given language is valid for highlight.js.
    const validLang = !!(language && highlightjs.getLanguage(language));
  
    // Highlight only if the language is valid.
    const highlighted = (validLang ? highlightjs.highlight(language, code).value : code).replace(/^\s+/,'');
    
    // Render the highlighted code with `hljs` class.
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    
  }
  
  static titleToLink(val : string) : string {
    //was toLowerCase()-ing, but retaining case now
    return val.replace(/[^\w]+/g, '-');
  }
  
  process(mdTxt) {
    MarkDown.headingCtr = 0;
    MarkDown.firstIntermediateHeader = true;
    
    marked.setOptions({
        renderer: MarkDown.renderer,
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
  
  
}
