const { series } = require('gulp');
const { task: shellTask } = require('gulp-shell');
const { existsSync } = require('fs');

const buildDev = cb => shellTask(['ng build'])(cb);

const buildProd = cb => shellTask(['ng build --prod'])(cb);

const copyConfig = cb => shellTask(['cp -rf config.xml cordova/config.xml'])(cb);

const copyResourses = cb => shellTask(['cp -rf resources cordova/.'])(cb);

const cordovaAddAndroid = cb => shellTask(['cd cordova; cordova platform add android'])(cb);

const cordovaRunAndroid = cb => shellTask(['cd cordova; cordova run android'])(cb);

exports.clean = cb => shellTask(['rm -rf cordova'])(cb);

exports.addAndroid = series(copyConfig, copyResourses, cordovaAddAndroid);

exports.runAndroid =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildDev, cordovaRunAndroid)
    : series(exports.clean, buildDev, exports.addAndroid, cordovaRunAndroid);

exports.runAndroidProd =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildProd, cordovaRunAndroid)
    : series(exports.clean, buildProd, exports.addAndroid, cordovaRunAndroid);
