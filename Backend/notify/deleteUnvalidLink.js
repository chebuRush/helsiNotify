const Firebase = require('./../FireBase');

const ONE_DOCTOR_VISIT_COST = 5;

function clearUserAndReturnMoney(uid, link) {
    return new Promise((resolve, reject) => {
        let amountOfdeletions;
        Firebase.DataBase
            .getData({}, `users/${uid}/doctors`, 'userDoctors')
            .then(data => {
                const unique = [
                    ...new Set(Object.keys(data.userDoctors).filter(key => data.userDoctors[key].doctorLink === link))
                ];
                amountOfdeletions = unique.length;
                return unique.map(item => Firebase.DataBase.deleteData(`users/${uid}/doctors/${item}`));
            })
            .then(() =>
                Firebase.DataBase.updateSensitiveData(uid, money => {
                    if (money !== null) {
                        return {
                            available: +money.available + ONE_DOCTOR_VISIT_COST * amountOfdeletions,
                            freezed: +money.freezed - ONE_DOCTOR_VISIT_COST * amountOfdeletions,
                            used: +money.used
                        };
                    }
                    return null;
                })
            )
            .then(() => resolve())
            .catch(e => reject(e));
    });
}

function deleteUnvalidLink(linkToBeEncoded) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `doctorList`, 'usersWith404url', linkToBeEncoded)
            .then(data => {
                if (data.usersWith404url) {
                    const unique = [
                        ...new Set(Object.keys(data.usersWith404url).map(key => data.usersWith404url[key]))
                    ];
                    unique.map(item => clearUserAndReturnMoney(item, linkToBeEncoded));
                }
                return Firebase.DataBase.deleteData('doctorList', linkToBeEncoded);
            })
            .catch(e => reject(e.message));
    });
}

module.exports = deleteUnvalidLink;
