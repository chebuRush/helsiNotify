const FireBase = require('./../../FireBase');

function cleanDbRemovingUser(uid) {
    return new Promise((resolve, reject) => {
        FireBase.DataBase
            .getData({}, `doctorList`, 'doctorList')
            .then(data => {
                Object.keys(data.doctorList).map(link =>
                    Object.keys(data.doctorList[link]).map(uniqueId => {
                        if (data.doctorList[link][uniqueId] === uid) {
                            FireBase.DataBase.deleteData('doctorList', link, uniqueId);
                        }
                    })
                );
            })
            .then(FireBase.DataBase.deleteData(`users/${uid}/`))
            .then(() => resolve())
            .catch(e => {
                reject(e);
            });
    });
}

module.exports = cleanDbRemovingUser;
