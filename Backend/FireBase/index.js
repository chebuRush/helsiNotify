import index from './index';

import Account0 from './Account';

const firebase = require('firebase');
const userServiceAccount = require('../../config/firebaseServiceAccountKey.json');

const appUser = firebase.initializeApp(userServiceAccount);

const firebaseAdmin = require('firebase-admin');
const adminServerAccount = require('../../config/firebaseAdminServiceAccount.json');

const appAdmin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(adminServerAccount),
    databaseURL: 'https://helsinotify-2018.firebaseio.com'
});

module.exports = {
    Account: Account0(appUser),
    DataBase: index(appAdmin)
};
