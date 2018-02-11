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
        checkAuth(req, res, next) {
            const user = firebase.auth().currentUser;
            if (user !== null) {
                req.user = user;
                next();
            } else {
                res.redirect('/');
            }
        },
        forgetPassword(emailAddress) {
            return new Promise((resolve, reject) => {
                const auth = firebase.auth();
                auth
                    .sendPasswordResetEmail(emailAddress)
                    .then(() => {
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    };
}

module.exports = Account;
