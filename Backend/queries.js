const config = require('config');
const path = require('path');

const FireBase = require('./FireBase');
const cleanDBRemovingUsers = require('./FireBase/DataBase/cleanDbRemovingUser');
const responses = require('./Responses/response');
const ONE_DOCTOR_VISIT_COST = require('config').get('ONE_DOCTOR_VISIT_COST');
const generatePaymentForm = require('./Payment').encodeFormPay;
const checkStateAndSignature = require('./Payment').checkStateAndSignature;

// TODO F confirm, alert blocks
// TODO FB change password
// TODO F mobile version
// TODO FB connect payment

/*
* Doctor status
* 0 - Stopped for looking for
* 1 - Looking for
* 2 - Founded & Notified
* 3 - Overdue time limit
*/

function queries(app, notifyRouter) {
    /* CORS maintaining */

    // app.use((req, res, next) => {
    //     res.append('Access-Control-Allow-Origin', ['*']);
    //     res.append('Access-Control-Allow-Credentials', 'true');
    //     res.append('Access-Control-Allow-Headers', 'origin, content-type, accept');
    //     next();
    // });

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

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
                                const userWithStatusCode = Object.assign(
                                    {},
                                    { user },
                                    {
                                        statusHelsiCode: '200',
                                        ONE_DOCTOR_VISIT_COST: config.get('ONE_DOCTOR_VISIT_COST')
                                    }
                                );
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

    app.post('/appDeleteAccount', FireBase.Account.checkAuth, (req, res) => {
        const user = req.user;
        user
            .delete()
            .then(cleanDBRemovingUsers(user.uid))
            .then(() => responses.sendOK(res))
            .catch(e => responses.wrongParams(res, e.message));
    });

    app.post('/appForgetPassword', (req, res) => {
        const { email: emailAddress } = req.body;
        FireBase.Account
            .forgetPassword(emailAddress)
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
                const dataWithStatusCode = Object.assign({}, data, {
                    statusHelsiCode: '200',
                    ONE_DOCTOR_VISIT_COST: config.get('ONE_DOCTOR_VISIT_COST')
                });
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
                const dataWithStatusCode = Object.assign({}, data, {
                    statusHelsiCode: '200',
                    ONE_DOCTOR_VISIT_COST: config.get('ONE_DOCTOR_VISIT_COST')
                });
                res.json(dataWithStatusCode);
            })
            .catch(e => console.error(e.message));
    });

    app.post('/changePersonalData', FireBase.Account.checkAuth, (req, res) => {
        const { emailToNotify } = req.body;
        let { tel } = req.body;
        const uid = req.user.uid;
        if (tel === '') {
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
        } else {
            tel = tel.indexOf('+38') === 0 ? tel : `+38${tel}`;
            if (tel.length === 13) {
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
            } else {
                responses.wrongParams(res, 'Введіть телефон у форматі: +38хххххххххх');
            }
        }
    });
    app.post('/addDoctor', FireBase.Account.checkAuth, (req, res) => {
        const { doctorLink } = req.body;
        const { dateFrom, dateTo, userGenId } = req.body;
        const uid = req.user.uid;
        if (doctorLink.indexOf('https://helsi.me/') === 0 && dateFrom && dateTo && userGenId) {
            FireBase.DataBase
                .getData({}, `users/${uid}/personalData/money`, 'money')
                .then(data => {
                    if (data.money.available >= ONE_DOCTOR_VISIT_COST) {
                        FireBase.DataBase
                            .updateSensitiveData(uid, money => {
                                if (money !== null) {
                                    return {
                                        available: +money.available - ONE_DOCTOR_VISIT_COST,
                                        freezed: +money.freezed + +ONE_DOCTOR_VISIT_COST,
                                        used: +money.used
                                    };
                                }
                                return null;
                            })
                            .then(
                                Promise.all[
                                    (FireBase.DataBase.updateData(`users/${uid}`, {
                                        doctors: {
                                            [userGenId]: {
                                                doctorLink: doctorLink.toLowerCase(),
                                                dateFrom,
                                                dateTo,
                                                status: 1,
                                                timeStamp: new Date()
                                            }
                                        }
                                    }), FireBase.DataBase.updateDataViaPush(
                                        'doctorList',
                                        doctorLink.toLowerCase(),
                                        uid
                                    ))
                                ]
                            );
                    } else {
                        throw new Error('Not enough money');
                    }
                })
                .then(() => responses.sendOK(res))
                .catch(e => {
                    if (e.message === 'Not enough money') responses.forbidden(res, e.message);
                });
        } else {
            responses.wrongParams(res, 'Введіть усі необхідні дані');
        }
    });

    app.post('/deleteDoctor', FireBase.Account.checkAuth, (req, res) => {
        const { id: doctorIdForUser, removeAnyway = false } = req.body;
        const uid = req.user.uid;
        if (doctorIdForUser) {
            FireBase.DataBase
                .getData({}, `users/${uid}/doctors/${doctorIdForUser}`, 'doc')
                .then(data => {
                    // "2018-02-07T22:45:06%2E962Z"
                    if (new Date() - Date.parse(data.doc.timeStamp) < 1000 * 60 * 60) {
                        Promise.all([
                            FireBase.DataBase.deleteData(`users/${uid}/doctors/${doctorIdForUser}`),
                            FireBase.DataBase
                                .getData({}, `doctorList`, 'usersforOneDoc', data.doc.doctorLink)
                                .then(doctorList => {
                                    let deleteId;
                                    if (doctorList.usersforOneDoc) {
                                        deleteId = Object.keys(doctorList.usersforOneDoc).filter(
                                            key => doctorList.usersforOneDoc[key] === uid
                                        );
                                    }
                                    return FireBase.DataBase.deleteData('doctorList', data.doc.doctorLink, deleteId[0]);
                                }),
                            FireBase.DataBase.updateSensitiveData(uid, money => {
                                if (money) {
                                    return {
                                        available: +money.available + +ONE_DOCTOR_VISIT_COST,
                                        freezed: +money.freezed - ONE_DOCTOR_VISIT_COST,
                                        used: +money.used
                                    };
                                }
                                return null;
                            })
                        ]);
                    } else if (removeAnyway) {
                        Promise.all([
                            FireBase.DataBase.deleteData(`users/${uid}/doctors/${doctorIdForUser}`),
                            FireBase.DataBase
                                .getData({}, `doctorList`, 'usersforOneDoc', data.doc.doctorLink)
                                .then(doctorList => {
                                    let deleteId;
                                    if (doctorList.usersforOneDoc) {
                                        deleteId = Object.keys(doctorList.usersforOneDoc).filter(
                                            key => doctorList.usersforOneDoc[key] === uid
                                        );
                                    }
                                    return FireBase.DataBase.deleteData('doctorList', data.doc.doctorLink, deleteId[0]);
                                }),
                            FireBase.DataBase.updateSensitiveData(uid, money => {
                                if (money) {
                                    return {
                                        available: +money.available,
                                        freezed: +money.freezed - ONE_DOCTOR_VISIT_COST,
                                        used: +money.used + +ONE_DOCTOR_VISIT_COST
                                    };
                                }
                                return null;
                            })
                        ]);
                    } else {
                        throw new Error(`Can't delete without losing money`);
                    }
                })
                .then(() => responses.sendOK(res))
                .catch(e => {
                    if (e.message === `Can't delete without losing money`)
                        responses.forbidden(res, 'Видаляючи більш ніж через годину гроші повернені не будуть');
                });
        } else {
            responses.wrongParams(res);
        }
    });

    app.post('/appReceivePayForm', FireBase.Account.checkAuth, (req, res) => {
        const { amountForPay } = req.body;
        if (amountForPay) {
            const uid = req.user.uid;
            const generatedForm = generatePaymentForm(amountForPay, uid);
            responses.sendOK(res, generatedForm);
        } else {
            responses.wrongParams(res, 'amountForPay value is required');
        }
    });

    app.post('/receivePaymentResultFromWalletOne', (req, res) => {
        console.log('here');
        const { WMI_PAYMENT_AMOUNT, WMI_ORDER_STATE, WMI_SIGNATURE, TransactionUserId } = req.body;
        if (
            WMI_PAYMENT_AMOUNT &&
            WMI_ORDER_STATE &&
            WMI_SIGNATURE &&
            TransactionUserId &&
            checkStateAndSignature(req.body)
        ) {
            FireBase.DataBase
                .updateSensitiveData(TransactionUserId, money => {
                    if (money) {
                        return {
                            available: +money.available + +WMI_PAYMENT_AMOUNT,
                            freezed: +money.freezed,
                            used: +money.used
                        };
                    }
                    return null;
                })
                .then(() => res.end('WMI_RESULT=OK'))
                .catch(() => res.end('WMI_RESULT=RETRY&WMI_DESCRIPTION=Помилка в оновленні грошових коштів'));
        } else {
            res.end('WMI_RESULT=RETRY&WMI_DESCRIPTION=Помилка на этапі перевірки даних');
        }
    });
}

module.exports = queries;
