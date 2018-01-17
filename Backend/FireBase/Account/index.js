let appSignInEmailPass = require("./appSignInEmailPassword");
let appSignUpEmailPass = require("./appSignUpEmailPassword");
let appSignOutEmailPass = require("./appSignOutEmailPassword");

function Account(firebase){
    return {
        signInEmailPass(email,password){
            return appSignInEmailPass(firebase, email, password);
        },
        signUpEmailPass(email, password){
            return appSignUpEmailPass(firebase, email, password);
        },
        signOutEmailPass(){
            return appSignOutEmailPass(firebase);
        }
    };
}

module.exports = Account;
