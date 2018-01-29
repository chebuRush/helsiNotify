const appSignInEmailPass = require('./appSignInEmailPassword');
const appSignUpEmailPass = require('./appSignUpEmailPassword');
const appSignOutEmailPass = require('./appSignOutEmailPassword');

function Account(firebase) {
    return {
        signInEmailPass(email, password) {
            return appSignInEmailPass(firebase, email, password);
        },
        signUpEmailPass(email, password) {
            return appSignUpEmailPass(firebase, email, password);
        },
        signOutEmailPass() {
            return appSignOutEmailPass(firebase);
        },
        isAuthenticated(req, res, next) {
            const user = firebase.auth().currentUser;
            if (user !== null) {
                req.user = user;
                next();
            } else {
                res.redirect('/');
            }
        }
    };
}

module.exports = Account;
