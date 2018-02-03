function appSignUpEmailPass(firebase, email, password) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userData => {
                firebase.auth().onAuthStateChanged(user => {
                    user.sendEmailVerification();
                    resolve(userData);
                });
            })
            .catch(error => {
                reject(new Error(`Error in signUp:${error.message}`));
            });
    });
}

module.exports = appSignUpEmailPass;
