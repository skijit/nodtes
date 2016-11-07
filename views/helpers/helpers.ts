import DirTree from '../../core/DirectoryReaders/DirTree';

export function scrollSpy(items, options) {
  let out = '',
      prevLevel : number = 1;

  if (items !== undefined) {
    for(var i=0, l=items.length; i<l; i++) {
      
      if (items[i].level > prevLevel) {         //push
        out += "<ul>";
      } else if (items[i].level < prevLevel) {  //pop
        out += "</li>\r\n</ul>\r\n";
      } else {                                  //stay on cur level
        if (i > 0) {
          out += "</li>\r\n";
        }
      }
      out += "<li>" + options.fn(items[i]);
      prevLevel = items[i].level;
    }
  }
  
  return out;
}

export function breadCrumb(items, options) {
  let out = '';
   
  if (items === undefined) { return '';}
  
  for(var i = 0; i < items.length; i++) {
    out += `<a href='/${items.slice(0, i+1).join('/')}' class='breadcrumb'> ${items[i]} </a>`;
  }
  
  return out;
}

export function dirEntry(items, options) {
  let out = '';
   
  if (items === undefined) { return '';}
  
  for(var i = 0; i < items.length; i++) {
    out += `<li><a href='${items[i].path}'> ${items[i].name} </a></li>`;
  }
  
  return out;
}

export function siteDirectory(tree, options) {
  let out = '';
  
  //loop over directory
  out += processDirectory(tree);
  
  return out;
  
}

function processDirectory(dirTree) : string {
  let out = '';
  let props = [];
  
  if (dirTree !== undefined) {
    props = Object.getOwnPropertyNames(dirTree);
  }   
  
  for(var i = 0; i < props.length; i++) {
    if (DirTree.isPropADir(props[i])) {
      let activePath = dirTree[props[i]].activePath ? "class='active-path'" : '';
      
      //print out cur node
      out += `<li ${activePath}>
                <a href='#' class='tree-dir'><i class="material-icons">keyboard_arrow_right</i> ${dirTree[props[i]].dirName} </a>
                <ul class="tree-dir-contents">`
      
      //print any subdirs
      out += processDirectory(dirTree[props[i]]);
       
      //close cur node
      out += "</ul></li>"
     
    }
  }
    
  // print out files, it it has any
  out += processFiles(dirTree);
    
  return out;
}
  
  
function processFiles(dirTree) : string {
  let out = '';
  if (dirTree != undefined && dirTree.files !== undefined && dirTree.files.length > 0) {
    for(var j = 0; j < dirTree.files.length; j++) {
      let curDirTreePath = dirTree.path === '/' ? '' : dirTree.path;
      let nodeActivePath = (dirTree.activePath && (curDirTreePath+'/'+ dirTree.files[j]).toLowerCase() === dirTree.reqUrl.toLowerCase()) ? 'class="active-path"' : '';
      out += `<li ${nodeActivePath} ><a href='${curDirTreePath + '/' + dirTree.files[j]}' class='tree-node'> ${dirTree.files[j]} </a></li>`;
    }
  }
  return out;
}