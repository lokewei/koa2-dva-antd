require('babel-core/register')({
  // plugins: ['transform-async-to-generator'],
  // retainLines: process.env.NODE_ENV === 'development',
  sourceMaps: 'both'
  // presets: ['stage-0', 'es2015']
});
require('babel-polyfill');

require('./server/app.js');
