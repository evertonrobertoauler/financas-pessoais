import { src, dest, series, parallel } from 'gulp';
import { task as shellTask } from 'gulp-shell';
import * as replace from 'gulp-replace';
import { existsSync } from 'fs';
import { webClientId } from './config/public';

const buildDev = () => shellTask(['ng build'])();

const buildDevR = () => shellTask(['ng build --deploy-url=http://192.168.2.120:4200/'])();

const serveDev = () => shellTask(['ng serve --host=0.0.0.0 --port=4200 --live-reload=false'])();

const buildProd = () => shellTask(['ng build --prod'])();

const addCordovaScript = () =>
  src(['cordova/www/index.html'])
    .pipe(replace('</head>', `<script src="cordova.js"></script>\n</head>`))
    .pipe(dest('cordova/www/'));

const copyConfig = () => shellTask(['cp -rf config.xml cordova/config.xml'])();

const replaceWebClientId = replace(
  /"WEB_APPLICATION_CLIENT_ID"\s+value=""/gi,
  `"WEB_APPLICATION_CLIENT_ID" value="${webClientId}"`
);

const setWebClientId = () =>
  src(['cordova/config.xml'])
    .pipe(replaceWebClientId)
    .pipe(dest('cordova/'));

const copyGoogleConfig = () => shellTask(['cp -rf config/google-services.json cordova/.'])();

const copyResourses = () => shellTask(['cp -rf resources cordova/.'])();

const cordovaAddAndroid = () => shellTask(['cd cordova; cordova platform add android'])();

const cordovaRunAndroid = () => shellTask(['cd cordova; cordova run android'])();

export const clean = () => shellTask(['rm -rf cordova'])();

export const addAndroid = series(
  copyConfig,
  setWebClientId,
  copyGoogleConfig,
  copyResourses,
  cordovaAddAndroid
);

export const runAndroidRemote = existsSync('cordova/plugins/cordova-plugin-ionic-webview')
  ? series(buildDevR, addCordovaScript, parallel(cordovaRunAndroid, serveDev))
  : series(clean, buildDevR, addCordovaScript, addAndroid, parallel(cordovaRunAndroid, serveDev));

export const runAndroid = existsSync('cordova/plugins/cordova-plugin-ionic-webview')
  ? series(buildDev, addCordovaScript, cordovaRunAndroid)
  : series(clean, buildDev, addCordovaScript, addAndroid, cordovaRunAndroid);

export const runAndroidProd = existsSync('cordova/plugins/cordova-plugin-ionic-webview')
  ? series(buildProd, addCordovaScript, cordovaRunAndroid)
  : series(clean, buildProd, addCordovaScript, addAndroid, cordovaRunAndroid);
