const Firebase = require('./../FireBase');
const notifyUser = require('./NotifyUserViaEmailSMS');
const updateStatusTo3AndReturnMoney = require('./updateStatusTo3AndReturnMoney');
const config = require('config');

const ONE_DOCTOR_VISIT_COST = config.get('ONE_DOCTOR_VISIT_COST');

function getDateInFormat(dt) {
    return `${dt.getFullYear()}-${dt.getMonth() + 1 < 10 ? `0${dt.getMonth() + 1}` : dt.getMonth() + 1}-${dt.getDate() < 10 ? `0${dt.getDate()}` : dt.getDate()}`;
}

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
                // eslint-disable-next-line array-callback-return
                Object.keys(data.userDoctors).map(key => {
                    if (
                        data.userDoctors[key].dateTo < getDateInFormat(new Date()) &&
                        data.userDoctors[key].status === 1
                    ) {
                        Promise.resolve(updateStatusTo3AndReturnMoney(uid, key));
                    }
                });
                const neededKey = Object.keys(data.userDoctors).filter(
                    key => data.userDoctors[key].doctorLink === link && data.userDoctors[key].status === 1
                );
                const neededKeyFirstElem = neededKey[0];
                if (neededKey.length) {
                    let fittedDataIndex = -1;
                    for (let i = arrayOfDates.length; i >= 0; i -= 1) {
                        if (
                            data.userDoctors[neededKeyFirstElem].dateFrom < arrayOfDates[i] &&
                            arrayOfDates[i] < data.userDoctors[neededKeyFirstElem].dateTo
                        ) {
                            fittedDataIndex = i;
                            break;
                        }
                    }
                    if (fittedDataIndex !== -1) {
                        arrayOfDates.splice(fittedDataIndex, 1);
                        Promise.all([
                            notifyUser(uid, link),
                            sweepDBAndGetMoney(uid, link, neededKeyFirstElem, keyForDoctorList)
                        ]);
                    } else {
                        resolve('Not Found');
                    }
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
    console.log('link', link);
    const UsersForDoctorLink = await getUsersForDoctorLink(link);
    console.log('UsersForDoctorLink: ', UsersForDoctorLink);
    if (UsersForDoctorLink) {
        const keysUsersForDoctorLink = await Object.keys(UsersForDoctorLink);
        let i = 0;
        console.log('keysUserForDoctor :', keysUsersForDoctorLink);
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
}

module.exports = notifyUsersAndGetMoney;
