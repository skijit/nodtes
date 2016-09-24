Current List of TODOs For Nodtes
=================

- **Documentation**
  - better sample page and use as a default page
  - Better Readme
  
- **Bugs**
  - change the isRunningOnMac config to be just about delimeter, as the Azure version needs a fwd delimeter
  - move all resources locally (e.g. mathjax, jquery, fonts, etc) to work in disconnected mode
  - nodemon multiple restarts.  should test against OSX and look more into this.
  - Handle running out of space in filehierarchy better

- **Missing functionality**
  - Directory pages

- **Front-End**
  - set up sass
  - scrollspy padding / real-estate / scaling solution- when lots of items

- **Back-End**
  - configuration for a:
    - primary local root
    - set of secondary local roots: journal, etc.
  - delimeter setting : get a cross platform solution so it's not configurable
    - verify works/behavior for local and remote mode in:
        - PC
        - Mac
        - Cloud
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
  - Hotlink to Google Roboto font for remote mode

- **Architecture**
  - Better use of 'controller' logic than in routing

- **Build process**
  - Streamline Azure deployment process and update documentation as such
  - Minify CSS/Javascript
  - SAss Gulp task
  - more gulp tasks like delinting, etc.
  