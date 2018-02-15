const firebaseEncoder = require('firebase-encode');

function getDataFireBase(ref, user, obj, fieldName, additionalPathToBeDecoded = '') {
    return new Promise((resolved, rejected) => {
        const objPath = `/${JSON.parse(firebaseEncoder.encode(JSON.stringify(additionalPathToBeDecoded)))}`;
        ref
            .child(`${obj}${objPath}`)
            .once('value')
            .then(objectBack => {
                resolved(
                    Object.assign({}, user, {
                        [fieldName]: JSON.parse(firebaseEncoder.decode(JSON.stringify(objectBack.val())))
                    })
                );
            })
            .catch(e => rejected(new Error(`Error in getDataFireBase: ${e.message}`)));
    });
}

module.exports = getDataFireBase;
