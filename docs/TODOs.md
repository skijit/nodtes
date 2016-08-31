Current List of TODOs For Nodtes
=================

- **Documentation**
  - update readme with better, more detailed description
  - better sample page
- **Bugs**
  - change the isRunningOnMac config to be just about delimeter, as the Azure version needs a fwd delimeter
  - move all resources locally (e.g. mathjax, jquery, fonts, etc) to work in disconnected mode
  - nodemon multiple restarts.  should test against OSX and look more into this.
  - Handle running out of space in filehierarchy better
- **Missing functionality**
  - Directory pages
- **Front-End**
  - set up sass
  - less vertical space between title and breadcrumb header
  - title is not perfectly centered
- **Back-End**
  - Use conditional view (handlebars) logic to apply the manifest container rather than in MdFile
  - platform-independent parsing - currently the delimeters are configured based on platform which is not nice
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
  - Streamline Azure deployment process and update documentation as such
  - Minify CSS/Javascript
  - SAss Gulp task
  - more gulp tasks like delinting, etc.
  