const Firebase = require('./../FireBase');
const notifyUser = require('./emailNotification');
const config = require('config');

const ONE_DOCTOR_VISIT_COST = config.get('ONE_DOCTOR_VISIT_COST');

function sweepDBAndGetMoney(uid, link, keyForUsersDoctor, keyForDoctorList) {
    return new Promise((resolve, reject) =>
        Firebase.DataBase
            .updateData(`users/${uid}`, {
                doctors: {
                    [keyForDoctorList]: {
                        status: 2
                    }
                }
            })
            .then(() => Firebase.DataBase.deleteData('doctorList', link, keyForDoctorList))
            .then(() =>
                Firebase.DataBase.updateSensitiveData(uid, money => {
                    if (money !== null) {
                        return {
                            available: +money.available,
                            freezed: +money.freezed - ONE_DOCTOR_VISIT_COST,
                            used: +money.used + +ONE_DOCTOR_VISIT_COST
                        };
                    }
                    return null;
                })
            )
            .catch(e => reject(e))
    );
}

function checkSeparateUser(uid, keyForDoctorList, link, arrayOfDates) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `users/${uid}/doctors`, 'userDoctors')
            .then(data => {
                const neededKey = Object.keys(data.userDoctors).filter(
                    key => data.userDoctors[key].doctorLink === link
                )[0];
                let fittedDataIndex = -1;
                for (let i = arrayOfDates.length; i >= 0; i -= 1) {
                    if (
                        data.userDoctors[neededKey].dateFrom < arrayOfDates[i] &&
                        arrayOfDates[i] < data.userDoctors[neededKey].dateTo
                    ) {
                        fittedDataIndex = i;
                        break;
                    }
                }
                if (fittedDataIndex !== -1) {
                    notifyUser(uid, link);
                    arrayOfDates.splice(fittedDataIndex, 1);
                    return sweepDBAndGetMoney(uid, link, neededKey, keyForDoctorList);
                }
            })
            .then(() => resolve())
            .catch(e => reject(e));
    });
}

function getUsersForDoctorLink(link) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `doctorList`, 'userList', link)
            .then(data => resolve(data.userList))
            .catch(e => reject(e.message));
    });
}

async function notifyUsersAndGetMoney(link, arrayOfDates) {
    await getUsersForDoctorLink();
}

checkSeparateUser('N8sesFHEckbEaL9x6UG43U6hc0O2', '-L4XKcRNdgGoZIh593lM', 'https://helsi.me/doctor/shv_20', [
    '2018-02-05',
    '2018-02-06',
    '2018-02-07',
    '2018-02-08',
    '2018-02-09',
    '2018-02-12',
    '2018-02-13',
    '2018-02-14',
    '2018-02-15',
    '2018-02-16'
]);

// getUsersForDoctorLink('https://helsi.me/doctor/shv_20');
module.exports = notifyUsersAndGetMoney;
