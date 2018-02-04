const firebaseEncoder = require('firebase-encode');

function deleteDataFireBase(ref, child, path = '') {
    const encodedPath = JSON.parse(firebaseEncoder.encode(JSON.stringify(path)));
    return new Promise((resolve, reject) => {
        ref
            .child(`${child}/${encodedPath}`)
            .remove()
            .then(() => resolve())
            .catch(error => reject(new Error(`Something has happened with deleteDataFireBase: ${error.message}`)));
    });
}

module.exports = deleteDataFireBase;
