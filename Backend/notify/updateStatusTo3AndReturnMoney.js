const Firebase = require('../FireBase');
const config = require('config');

const ONE_DOCTOR_VISIT_COST = config.get('ONE_DOCTOR_VISIT_COST');

function updateStatus3ReturnMoney(uid, key, doctorLink) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .setData(`users/${uid}/doctors/${key}/status`, 3)
            .then(() => {
                Promise.all([
                    Firebase.DataBase.updateSensitiveData(uid, money => {
                        if (money !== null) {
                            return {
                                available: +money.available + +ONE_DOCTOR_VISIT_COST,
                                freezed: +money.freezed - +ONE_DOCTOR_VISIT_COST,
                                used: +money.used
                            };
                        }
                        return null;
                    }),
                    Firebase.DataBase.getData({}, `doctorList`, 'usersforOneDoc', doctorLink).then(doctorList => {
                        let deleteId;
                        if (doctorList.usersforOneDoc) {
                            deleteId = Object.keys(doctorList.usersforOneDoc).filter(
                                key => doctorList.usersforOneDoc[key] === uid
                            );
                        }
                        return Firebase.DataBase.deleteData('doctorList', doctorLink, deleteId[0]);
                    })
                ]);
            })
            .then(() => resolve())
            .catch(e => {
                reject(e);
            });
    });
}

module.exports = updateStatus3ReturnMoney;
