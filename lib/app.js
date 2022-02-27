const path = require('path');
var appRoot = path.join(__dirname, '.');
console.log('appRoot: ', appRoot);

require('electron-compile').init(appRoot, './main.js');
