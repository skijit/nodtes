Deployment Instructions
===================

- **Local installation**
  - Set the appropriate environment in bash:
    - `export NODE_ENV=development` (default)
    - `export NODE_ENV=development_mac`
    - `export NODE_ENV=production`
  - Update node packages: `npm install`
  - **_Possibly no longer needed_**: Updating typings: `node_modules/typings/dist/bin.js install`
  - Set up the bin folder:
    - `gulp clean`
    - `gulp fullCopy`
    - `gulp transpile`
  - `gulp default`
  
- **Cloud installation**
  - Copy the `bin` folder contents to the local git installation
  - Copy:
    - bower.json
    - iisnode.yml
    - License.md
    - package.json
    - README.md
    - ChangeLog.md
      - For now, remove the typings install script line.  It doesn't work on Azure.
  - `git commit -a -m 'update'`
  - `git push azure master`

- **Other notes**
  - Azure Login area:
    - https://portal.azure.com
    - username: work email acct
