Deployment Instructions
===================

## Restoring the Project
- Updating node packages: `npm install`
- Updating typings: `node_modules/typings/dist/bin.js install`
- Setting the appropriate environment in bash:
    - `export NODE_ENV=development` (default)
    - `export NODE_ENV=development_mac`
    - `export NODE_ENV=production`
- Might need to run `gulp transpile` a first time (once only) before running the default task.

## Older Notes
- Deployment Error Workaround:
    - to get this deployment to work, go to the azure cli (in browser), into the wwwroot and npm install ansi-styles.  You may only have to do this once.
- Deployment command:
    - `git push azure master`
- Azure Login area:
    - https://portal.azure.com
    - username: work email acct
- Other useful links:
    - [the getting started guide](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-nodejs-get-started/)
    - [how to customize the dns](https://azure.microsoft.com/en-us/documentation/articles/web-sites-custom-domain-name/)
