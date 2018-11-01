import { src, dest, series, parallel } from 'gulp';
import { task as shellTask } from 'gulp-shell';
import * as replace from 'gulp-replace';
import { existsSync } from 'fs';
import { webClientId } from './config/public';

const buildDev = cb => shellTask(['ng build'])(cb);

const buildDevR = cb => shellTask(['ng build --deploy-url=http://192.168.2.120:4200/'])(cb);

const serveDev = cb => shellTask(['ng serve --host=0.0.0.0 --port=4200 --live-reload=false'])(cb);

const buildProd = cb => shellTask(['ng build --prod'])(cb);

const addCordovaScript = () =>
  src(['cordova/www/index.html'])
    .pipe(replace('</head>', `<script src="cordova.js"></script>\n</head>`))
    .pipe(dest('cordova/www/'));

const copyConfig = cb => shellTask(['cp -rf config.xml cordova/config.xml'])(cb);

const replaceWebClientId = replace(
  /"WEB_APPLICATION_CLIENT_ID"\s+value=""/gi,
  `"WEB_APPLICATION_CLIENT_ID" value="${webClientId}"`
);

const setWebClientId = () =>
  src(['cordova/config.xml'])
    .pipe(replaceWebClientId)
    .pipe(dest('cordova/'));

const copyGoogleConfig = cb => shellTask(['cp -rf config/google-services.json cordova/.'])(cb);

const copyResourses = cb => shellTask(['cp -rf resources cordova/.'])(cb);

const cordovaAddAndroid = cb => shellTask(['cd cordova; cordova platform add android'])(cb);

const cordovaRunAndroid = cb => shellTask(['cd cordova; cordova run android'])(cb);

export const clean = cb => shellTask(['rm -rf cordova'])(cb);

export const addAndroid = series(
  copyConfig,
  setWebClientId,
  copyGoogleConfig,
  copyResourses,
  cordovaAddAndroid
);

export const runAndroidRemote =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildDevR, addCordovaScript, parallel(cordovaRunAndroid, serveDev))
    : series(clean, buildDevR, addCordovaScript, addAndroid, parallel(cordovaRunAndroid, serveDev));

export const runAndroid =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildDev, addCordovaScript, cordovaRunAndroid)
    : series(clean, buildDev, addCordovaScript, addAndroid, cordovaRunAndroid);

export const runAndroidProd =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildProd, addCordovaScript, cordovaRunAndroid)
    : series(clean, buildProd, addCordovaScript, addAndroid, cordovaRunAndroid);
