// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --

// import * as admin from 'firebase-admin';

// admin.initializeApp();

// const serviceAccount = require('../../../config/admin.json');

// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// const auth = admin.auth();

// Cypress.Commands.overwrite('visit', async (originalFn, url, options) => {
//   // const token = await auth.createCustomToken('123');

//   return originalFn(url, {
//     ...(options || {}),
//     onLoad: () => {
//       console.log('lalala', serviceAccount);
//     }
//   });
// });
