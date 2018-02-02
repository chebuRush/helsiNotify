function appSignInEmailPass(firebase, email, password) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                resolve(firebase.auth().currentUser);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = appSignInEmailPass;
