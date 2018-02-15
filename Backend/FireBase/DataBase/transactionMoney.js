// const firebaseEncoder = require('firebase-encode');

function updateSensitiveData(ref, uid, workWithMoneyFunction) {
    return new Promise((resolve, reject) => {
        ref
            .child(`users/${uid}/personalData/money`)
            .transaction(workWithMoneyFunction)
            .then(() => {
                resolve('Ok');
            })
            .catch(error => reject(new Error(`Something has happened with moneyTransaction: ${error.message}`)));
    });
}

module.exports = updateSensitiveData;
