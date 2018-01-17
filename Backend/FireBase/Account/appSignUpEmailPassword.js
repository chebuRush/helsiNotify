function appSignUpEmailPass(firebase, email, password) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = appSignUpEmailPass;
