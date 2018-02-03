const email = require('emailjs');

function sendEmail(emailAddress, doclink) {
    return new Promise((resolve, reject) => {
        const server = email.server.connect({
            user: 'helsi.notify@gmail.com',
            password: 'HelsiNotify2018',
            host: 'smtp.gmail.com',
            ssl: true
        });
        server.send(
            {
                text: `Hey! New doctor's (${doclink}) appointment is available. Book it now!`,
                from: 'Helsi Notification',
                to: emailAddress,
                subject: 'Doctor appointment available!'
            },
            (err, message) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

module.exports = sendEmail;
