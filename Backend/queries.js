const path = require('path');

const FireBase = require('./FireBase');
const responses = require('./Responses/response');
/*
* Doctor status
* 0 - Stopped for looking for
* 1 - Looking for
* 2 - Founded & Notified
* 3 - Overdue time limit
*/

function queries(app) {
    /* CORS maintaining */

    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Credentials', 'true');
        res.append('Access-Control-Allow-Headers', 'origin, content-type, accept');
        next();
    });

    // app.get('/', (req, res) => {
    //     res.sendFile(path.join(__dirname, '../public', 'index.html'));
    // });

    app.post('/appSignIn', (req, res) => {
        if (req.body.email && req.body.password) {
            const { email, password } = req.body;
            FireBase.Account
                .signInEmailPass(email, password)
                .then(user => FireBase.DataBase.getData({ user }, `users/${user.uid}/doctors`, 'userDoctors'))
                .then(data => {
                    const userWithStatusCode = Object.assign({}, data, { statusHelsiCode: '200' });
                    res.json(userWithStatusCode);
                })
                .catch(error => {
                    if (
                        error.message ===
                        'There is no user record corresponding to this identifier. The user may have been deleted.'
                    ) {
                        FireBase.Account
                            .signUpEmailPass(email, password)
                            .then(user =>
                                FireBase.DataBase.updateData(
                                    `users/${user.uid}`,
                                    {
                                        personalData: {
                                            emailToNotify: user.email,
                                            money: {
                                                available: 0,
                                                freezed: 0,
                                                used: 0
                                            }
                                        },
                                        doctorsNotified: ''
                                    },
                                    user
                                )
                            )
                            .then(user => {
                                const userWithStatusCode = Object.assign({}, { user }, { statusHelsiCode: '200' });
                                res.json(userWithStatusCode);
                            })
                            .catch(err => responses.wrongAuth(res, `Caught in queries:${err.message}`));
                    } else {
                        responses.wrongAuth(res, error.message);
                    }
                });
        } else {
            responses.wrongParams(res);
        }
    });

    app.post('/appSignOut', (req, res) => {
        FireBase.Account
            .signOutEmailPass()
            .then(() => responses.sendOK(res))
            .catch(error => responses.wrongAuth(res, error.message));
    });
    app.post('/getNotifications', FireBase.Account.checkAuth, (req, res) => {
        FireBase.DataBase
            .getData(
                { email: req.user.email, emailVerified: req.user.emailVerified },
                `users/${req.user.uid}/doctors`,
                'userDoctors'
            )
            .then(data => {
                const dataWithStatusCode = Object.assign({}, data, { statusHelsiCode: '200' });
                res.json(dataWithStatusCode);
            })
            .catch(e => console.error(e.message));
    });
    app.post('/getPersonalData', FireBase.Account.checkAuth, (req, res) => {
        FireBase.DataBase
            .getData(
                { email: req.user.email, emailVerified: req.user.emailVerified },
                `users/${req.user.uid}/personalData`,
                'personalData'
            )
            .then(data => {
                const dataWithStatusCode = Object.assign({}, data, { statusHelsiCode: '200' });
                res.json(dataWithStatusCode);
            })
            .catch(e => console.error(e.message));
    });
    app.post('/changePersonalData', FireBase.Account.checkAuth, (req, res) => {
        const { emailToNotify, tel } = req.body;
        const uid = req.user.uid;
        if (emailToNotify && tel) {
            FireBase.DataBase
                .updateData(`users/${uid}`, {
                    personalData: {
                        emailToNotify,
                        tel
                    }
                })
                .then(() => {
                    responses.sendOK(res);
                })
                .catch(e => {
                    console.error(e.message);
                });
        }
    });
    app.post('/addDoctor', FireBase.Account.checkAuth, (req, res) => {
        let { doctorLink } = req.body;
        const { dateFrom, dateTo, userGenId } = req.body;
        const uid = req.user.uid;
        if (doctorLink && dateFrom && dateTo && userGenId) {
            doctorLink = `https://${doctorLink.substring(doctorLink.indexOf('helsi.me'))}`;
            FireBase.DataBase
                .updateData(`users/${uid}`, {
                    doctors: {
                        [userGenId]: {
                            doctorLink,
                            dateFrom,
                            dateTo,
                            status: 1,
                            timeStamp: new Date()
                        }
                    }
                })
                .then(() => {
                    FireBase.DataBase
                        .updateDataViaPush('doctorList', doctorLink, uid)
                        .then(() => {})
                        .catch(e => console.error(e.message));
                    responses.sendOK(res);
                })
                .catch(e => {
                    console.error(e.message);
                });
        } else {
            responses.wrongParams(res);
        }
    });

    app.post('/deleteDoctor', FireBase.Account.checkAuth, (req, res) => {
        const { id: doctorIdForUser } = req.body;
        const uid = req.user.uid;
        if (doctorIdForUser) {
            FireBase.DataBase
                .deleteData(`users/${uid}`, `doctors/${doctorIdForUser}`)
                .then(() => responses.sendOK(res))
                .catch(e => {
                    console.error(e.message);
                });
        } else {
            responses.wrongParams(res);
        }
    });
}

module.exports = queries;
