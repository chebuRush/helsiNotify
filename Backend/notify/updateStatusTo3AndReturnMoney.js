const Firebase = require('../FireBase');
const config = require('config');

const ONE_DOCTOR_VISIT_COST = config.get('ONE_DOCTOR_VISIT_COST');

function updateStatus3ReturnMoney(uid, key) {
    Firebase.DataBase
        .setData(`users/${uid}/doctors/${key}/status`, 3)
        .then(() =>
            Firebase.DataBase.updateSensitiveData(uid, money => {
                if (money !== null) {
                    return {
                        available: +money.available + +ONE_DOCTOR_VISIT_COST,
                        freezed: +money.freezed - +ONE_DOCTOR_VISIT_COST,
                        used: +money.used
                    };
                }
                return null;
            })
        )
        .catch(e => {
            throw e;
        });
}

module.exports = updateStatus3ReturnMoney;
