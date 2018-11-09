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

const copyConfig16 = cb => shellTask(['cp -rf config-16.xml cordova/config.xml'])(cb);

const fixBaseUrl16 = () =>
  src(['cordova/www/index.html'])
    .pipe(replace('<base href="/">', `<base href="file:///android_asset/www/" />`))
    .pipe(dest('cordova/www/'));

const jsFetch = `
  var originalFetch = window.fetch;

  window.fetch = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
      }
      var url = args[0];
      if (typeof url === 'string' && url.match(/\.svg/)) {
          return new Promise(function (resolve, reject) {
              var req = new XMLHttpRequest();
              req.open('GET', url, true);
              req.addEventListener('load', function () {
                  resolve({ ok: true, text: function () { return Promise.resolve(req.responseText); } });
              });
              req.addEventListener('error', reject);
              req.send();
          });
      }
      else {
          return originalFetch.apply(void 0, args);
      }
  };
`;

const addFetch16 = () =>
  src(['cordova/www/index.html'])
    .pipe(replace('</head>', `<script type="text/javascript">${jsFetch}</script></head>`))
    .pipe(dest('cordova/www/'));

const fixAndroidGradleFlavor = () =>
  src(['cordova/platforms/android/build.gradle'])
    .pipe(replace('android {', `android {\n  flavorDimensions 'default'`))
    .pipe(dest('cordova/platforms/android/'));

const scriptSupportVersion = `
  configurations.all {
    resolutionStrategy {
        force 'com.android.support:support-v4:27.1.0'
    }
  }
`;

const fixAndroidGradleRepository = () =>
  src(['cordova/platforms/android/build.gradle'])
    .pipe(replace('allprojects', `${scriptSupportVersion}\nallprojects`))
    .pipe(dest('cordova/platforms/android/'));

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

const cordovaBuildAndroid = cb => shellTask(['cd cordova; cordova build android'])(cb);

const apk = 'cordova/platforms/android/build/outputs/apk/armv7/debug/android-armv7-debug.apk';
const cordovaInstallAndroid16 = cb => shellTask([`adb install -r ${apk}`])(cb);

const cordovaRunAndroid16 = series(cordovaBuildAndroid, cordovaInstallAndroid16);

export const clean = cb => shellTask(['rm -rf cordova'])(cb);

export const addAndroid = series(
  copyConfig,
  setWebClientId,
  copyGoogleConfig,
  copyResourses,
  cordovaAddAndroid
);

export const addAndroid16 = series(
  copyConfig16,
  setWebClientId,
  copyGoogleConfig,
  copyResourses,
  cordovaAddAndroid,
  fixAndroidGradleFlavor,
  fixAndroidGradleRepository
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

const fixIndexHtml16 = series(addCordovaScript, fixBaseUrl16, addFetch16);

export const runAndroid16 =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildDev, fixIndexHtml16, cordovaRunAndroid16)
    : series(clean, buildDev, fixIndexHtml16, addAndroid16, cordovaRunAndroid16);

export const runAndroid16Prod =
  existsSync('cordova/www') && existsSync('cordova/platforms/android')
    ? series(buildProd, fixIndexHtml16, cordovaRunAndroid16)
    : series(clean, buildProd, fixIndexHtml16, addAndroid16, cordovaRunAndroid16);
