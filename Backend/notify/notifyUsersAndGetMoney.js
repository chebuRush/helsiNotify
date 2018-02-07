const Firebase = require('./../FireBase');
const notifyUser = require('./emailNotification');
const config = require('config');

const ONE_DOCTOR_VISIT_COST = config.get('ONE_DOCTOR_VISIT_COST');

function sweepDBAndGetMoney(uid, link, keyForUsersDoctor, keyForDoctorList) {
    return new Promise((resolve, reject) =>
        Firebase.DataBase
            .setData(`users/${uid}/doctors/${keyForUsersDoctor}/status`, 2)
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
            .then(() => resolve())
            .catch(e => reject(e))
    );
}

function checkSeparateUser(uid, keyForDoctorList, link, arrayOfDates) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `users/${uid}/doctors`, 'userDoctors')
            .then(data => {
                const neededKey = Object.keys(data.userDoctors).filter(
                    key => data.userDoctors[key].doctorLink === link && data.userDoctors[key].status === 1
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
                    arrayOfDates.splice(fittedDataIndex, 1);
                    Promise.all([notifyUser(uid, link), sweepDBAndGetMoney(uid, link, neededKey, keyForDoctorList)]);
                } else {
                    resolve('Not Found');
                }
            })
            .then(() => {
                resolve('OK');
            })
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
    const UsersForDoctorLink = await getUsersForDoctorLink(link);
    const keysUsersForDoctorLink = await Object.keys(UsersForDoctorLink);
    let i = 0;
    while (arrayOfDates.length && i < keysUsersForDoctorLink.length) {
        await checkSeparateUser(
            UsersForDoctorLink[keysUsersForDoctorLink[i]],
            keysUsersForDoctorLink[i],
            link,
            arrayOfDates
        );
        i += 1;
    }
}

module.exports = notifyUsersAndGetMoney;
