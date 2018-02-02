const firebaseEncode = require('firebase-encode');

function deleteDataFireBase(ref, child, path) {
    return new Promise((resolve, reject) => {
        ref
            .child(`${child}/${path}`)
            .remove()
            .then(() => resolve())
            .catch(error => reject(new Error(`Something has happened with deleteDataFireBase: ${error.message}`)));
    });
}

module.exports = deleteDataFireBase;
