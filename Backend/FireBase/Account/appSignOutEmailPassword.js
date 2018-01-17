
function appSignOutEmailPass(firebase){
    return new Promise((resolve, reject) => {
        firebase.auth().signOut()
            .then(
                () => {
                    resolve();
                }
            )
            .catch(error => {
                reject(error);
            });
    });
}
module.exports = appSignOutEmailPass;