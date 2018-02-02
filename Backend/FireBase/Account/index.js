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
        // TODO insert isAuthenticated into code for sophisticated control
        checkAuth(req, res, next) {
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
