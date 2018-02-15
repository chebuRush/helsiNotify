const firebaseEncode = require('firebase-encode');

function updateDataViaPushFireBase(ref, path, link, uid) {
    return new Promise((resolve, reject) => {
        const linkEncoded = JSON.parse(firebaseEncode.encode(JSON.stringify(link)));
        ref
            .child(`${path}/${linkEncoded}`)
            .push(uid)
            .then(() => {
                resolve();
            })
            .catch(error => reject(new Error(`Something has happened with updateDataViaPush: ${error.message}`)));
    });
}

module.exports = updateDataViaPushFireBase;
