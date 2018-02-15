const Firebase = require('./../FireBase');

function getDoctorsListFromDB() {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, 'doctorList', 'doctorList')
            .then(data => resolve(data.doctorList))
            .catch(e => reject(e.message));
    });
}

module.exports = getDoctorsListFromDB;
