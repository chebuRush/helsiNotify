const email = require('emailjs');
const Firebase = require('./../FireBase');
const config = require('config');
const axios = require('axios');

function getUserPhoneEmailFromUid(uid) {
    return new Promise((resolve, reject) => {
        Firebase.DataBase
            .getData({}, `users/${uid}/personalData`, 'personalData')
            .then(data => resolve(data.personalData))
            .catch(e => reject(e));
    });
}

function sendSms(tel, message) {
    return new Promise((resolve, reject) => {
        const telWithoutPlus = tel.indexOf('+') === 0 ? tel.slice(1) : tel;
        axios
            .get(
                `https://api.mobizon.com/service/message/sendsmsmessage?apiKey=${config.get('MobizonSecretKey')}&recipient=${telWithoutPlus}&from=${config.get('AlphaName')}&text=${encodeURIComponent(message)}`
            )
            .then(resp => {
                if (resp.data.code === 0) {
                    resolve();
                } else {
                    reject(new Error(`SMS failed: ${resp.data}`));
                }
            })
            .catch(e => reject(e.message));
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
                    }
                );
                if (personalData.tel !== '') {
                    sendSms(personalData.tel, `У лікаря (${doclink}) є вільне місце! Забронюй`)
                        .then(() => resolve())
                        .catch(e => reject(e));
                } else {
                    resolve();
                }
            })
            .catch(e => reject(e));
    });
}

module.exports = sendEmailAndSMS;
