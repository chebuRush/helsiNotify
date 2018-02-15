function appSignUpEmailPass(firebase, email, password) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userData => {
                firebase.auth().onAuthStateChanged(user => {
                    if (user !== null) {
                        user.sendEmailVerification();
                        resolve(userData);
                    } else {
                        reject(new Error('user is null in appSignUpEmailPassword'));
                    }
                });
            })
            .catch(error => {
                reject(new Error(`Error in signUp:${error.message}`));
            });
    });
}

module.exports = appSignUpEmailPass;
