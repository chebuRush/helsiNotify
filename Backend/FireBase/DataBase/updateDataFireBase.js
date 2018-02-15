const firebaseEncode = require('firebase-encode');

function updateDataFireBase(ref, child, obj, callbackObj) {
    return new Promise((resolve, reject) => {
        const ParsedObj = JSON.parse(firebaseEncode.encode(JSON.stringify(obj)));
        ref
            .child(`${child}/${Object.keys(ParsedObj)[0]}`)
            .update(ParsedObj[Object.keys(ParsedObj)[0]])
            .then(() => {
                if (callbackObj) {
                    resolve(callbackObj);
                } else {
                    resolve();
                }
            })
            .catch(error => reject(new Error(`Something has happened with updateDataFireBase: ${error.message}`)));
    });
}

module.exports = updateDataFireBase;
