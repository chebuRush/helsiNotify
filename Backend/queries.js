const path = require('path');

const FireBase = require('./FireBase');
const responses = require('./Responses/response');

function queries(app) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    app.post('/appSignIn', (req, res) => {
        if (req.body.email && req.body.password) {
            const { email, password } = req.body;
            FireBase.Account
                .signInEmailPass(email, password)
                .then(user => {
                    const userWithStatusCode = Object.assign({}, user, { statusHelsiCode: '200' });
                    res.json(userWithStatusCode);
                })
                .catch(error => {
                    if (
                        error.message ===
                        'There is no user record corresponding to this identifier. The user may have been deleted.'
                    ) {
                        FireBase.Account
                            .signUpEmailPass(email, password)
                            .then(user => {
                                const userWithStatusCode = Object.assign({}, user, { statusHelsiCode: '200' });
                                res.json(userWithStatusCode);
                            })
                            .catch(err => responses.wrongAuth(res, err.message));
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
}

module.exports = queries;
