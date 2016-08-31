Current List of TODOs For Nodtes
=================

- **Documentation**
  - better sample page
- **Bugs**
  - nodemon multiple restarts.  should test against OSX and look more into this.
  - Handle running out of space in filehierarchy better
- **Missing functionality**
  - Directory pages
- **Misc**
- **Front-End**
  - decide whether to host fonts or hotlink...
  - set up sass
  - less vertical space between title and breadcrumb header
  - title is not perfectly centered
- **Back-End**
  - Use conditional view (handlebars) logic to apply the manifest container rather than in MdFile
  - redis directory caching
  - toolbar: collapse/expand all - font-resize - hide rmenu - hide lmenu
  - optionally smaller tables
  - optionally smaller images
  - homepage with most recently updated files
  - use only async FS API calls
  - GitHub directory reading- more robust
  - Use a Promise.All rather than async/awaits for MdFile & SiteDirectory processing
  - more type-safety- such as with external libs
  - better error handling 
- **Architecture**
  - Better use of 'controller' logic than in routing
- **Build process**
  - Update the VSBuild profile to output to bin/target
  - Minify CSS/Javascript
  - SAss Gulp task
  - more gulp tasks like delinting, etc.
  