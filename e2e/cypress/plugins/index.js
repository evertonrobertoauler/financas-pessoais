// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const wp = require('@cypress/webpack-preprocessor');

const admin = require('firebase-admin');
const serviceAccount = require('../../../config/admin.json');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('file:preprocessor', wp({ webpackOptions: require('../../webpack.config') }));

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const auth = admin.auth();

  return auth.createCustomToken('iWpmnti9o3dXCG0BUT9nLPf2Zko1').then(token => {
    config.env.TOKEN = token;
    return config;
  });
};
