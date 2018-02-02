const firebaseEncode = require('firebase-encode');

function setDataFireBase(ref, child, obj) {
    return new Promise((resolve, reject) => {
        const ParsedObj = JSON.parse(firebaseEncode.encode(JSON.stringify(obj)));
        ref
            .child(`${child}/${Object.keys(ParsedObj)[0]}`)
            .set(ParsedObj[Object.keys(ParsedObj)[0]])
            .then(() => resolve())
            .catch(error => reject(new Error(`Something has happened with setDataFireBase: ${error.message}`)));
    });
}

module.exports = setDataFireBase;
