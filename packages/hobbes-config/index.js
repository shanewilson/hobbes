const path = require('path');

const config = new Map();

// ------------------------------------
// Project
// ------------------------------------
config.set('path_project', process.env.PWD);
// ------------------------------------
// User Configuration
// ------------------------------------
// NOTE: Due to limitations with Webpack's custom require, which is used for
// looking up all *.test.js files, if you edit dir_test you must also edit
// the path in ~/karma.entry.js.
config.set('dir_packages', path.join(config.get('path_project'), 'packages'));
config.set('dir_dist', path.join(config.get('path_project'), 'dist'));

// ------------------------------------
// Webpack
// ------------------------------------
config.set('webpack_host', process.env.HOST || 'localhost');
config.set('webpack_port', process.env.PORT || 8080);
config.set('webpack_public_path',
  `http://${config.get('webpack_host')}:${config.get('webpack_port')}/`
);
config.set('proxy', process.env.PROXY || 'http://localhost:5000');

/*  *********************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/
// ------------------------------------
// Environment
// ------------------------------------
config.set('env', process.env);
config.set('globals', {
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
  __API__: process.env.API || '/api/',
  NODE_ENV: process.env.NODE_ENV || 'development',
  __DEV__: process.env.NODE_ENV === 'development',
  __PROD__: process.env.NODE_ENV === 'production',
  __DEBUG__: process.env.NODE_ENV === 'development' && parseInt(process.env.DEBUG, 10) === 1,
  TEST_ENV: process.env.TEST_ENV,
  __BASE__: process.env.BASE || '',
});

// ------------------------------------
// Utilities
// ------------------------------------
const packageJSON = require(path.join(config.get('path_project'), 'package.json'));
const dependencies = Object.keys(packageJSON.dependencies);

config.set('dependencies', dependencies);

module.exports = config;
