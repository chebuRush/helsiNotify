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
                reject(error);
            });
    });
}

module.exports = appSignUpEmailPass;
