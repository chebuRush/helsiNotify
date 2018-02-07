const email = require('emailjs');
const Firebase = require('./../FireBase');

function getUserEmailFromUid(uid) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `users/${uid}/personalData`, 'personalData')
            .then(data => resolve(data.personalData.emailToNotify))
            .catch(e => reject(e));
    });
}

function sendEmail(uid, doclink) {
    return new Promise((resolve, reject) => {
        const server = email.server.connect({
            // TODO transfer data below to config file
            user: 'helsi.notify@gmail.com',
            password: 'HelsiNotify2018',
            host: 'smtp.gmail.com',
            ssl: true
        });
        getUserEmailFromUid(uid)
            .then(emailAddress => {
                server.send(
                    {
                        text: `Привіт! У лікаря (${doclink}) з'явилося вільне місце. Встигни забронювати!`,
                        from: 'Helsi Notification',
                        to: emailAddress,
                        subject: `Нове місце у лікаря (${doclink})`
                    },
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    }
                );
            })
            .catch(e => reject(e));
    });
}

module.exports = sendEmail;
