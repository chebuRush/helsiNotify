function appSignInEmailPass(firebase, email, password) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = appSignInEmailPass;
