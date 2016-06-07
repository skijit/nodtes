//Set env in git bash:  export $NODE_ENV="development"
//View env in git bash: echo $NODE_ENV

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nodtes'
    },
    layoutFile: 'main',
    localMode: true,
    markdownCssFile: 'gh-themed.css',
    remoteRoot: 'https://raw.githubusercontent.com/skijit/notes/master/',
    localRoot: 'C:/GitWorkspace/',
    port: process.env.PORT || 3000
  },
  
  development_mac: {
    root: rootPath,
    app: {
      name: 'nodtes'
    },
    layoutFile: 'main',
    localMode: true,
    markdownCssFile: 'gh-themed.css',
    remoteRoot: 'https://raw.githubusercontent.com/skijit/notes/master/',
    localRoot: '/Users/tomskjei/Documents/GitWorkspace/',
    port: process.env.PORT || 3000
  },

  test: {
    root: rootPath,
    app: {
      name: 'nodtes'
    },
    layoutFile: 'main',
    localMode: false,
    markdownCssFile: 'gh-themed.css',
    remoteRoot: 'https://raw.githubusercontent.com/skijit/notes/master/',
    localRoot: 'C:/GitWorkspace/',
    port: process.env.PORT || 3000
  },

  production: {
    root: rootPath,
    app: {
      name: 'nodtes'
    },
    layoutFile: 'main',
    localMode: false,
    markdownCssFile: 'gh-themed.css',
    remoteRoot: 'https://raw.githubusercontent.com/skijit/notes/master/',
    localRoot: 'C:/GitWorkspace/',
    port: process.env.PORT || 3000
  }
};

module.exports = config[env];
