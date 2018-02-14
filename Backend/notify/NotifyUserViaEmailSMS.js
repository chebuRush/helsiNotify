const email = require('emailjs');
const Firebase = require('./../FireBase');
const config = require('config');

function getUserPhoneEmailFromUid(uid) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `users/${uid}/personalData`, 'personalData')
            .then(data => resolve(data.personalData))
            .catch(e => reject(e));
    });
}

function sendEmailAndSMS(uid, doclink) {
    return new Promise((resolve, reject) => {
        const server = email.server.connect({
            user: config.get('EmailFromNotification.email'),
            password: config.get('EmailFromNotification.password'),
            host: config.get('EmailFromNotification.smtp'),
            ssl: config.get('EmailFromNotification.ssl')
        });
        getUserPhoneEmailFromUid(uid)
            .then(personalData => {
                server.send(
                    {
                        text: `Привіт! У лікаря (${doclink}) з'явилося вільне місце. Встигни забронювати!`,
                        from: 'Helsi Notification',
                        to: personalData.emailToNotify,
                        subject: `Нове місце у лікаря (${doclink})`
                    },
                    err => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    }
                );
                if (personalData.tel)
            })
            .catch(e => reject(e));

    });
}

function sendSms()
module.exports = sendEmail;
