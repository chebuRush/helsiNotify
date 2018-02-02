const firebaseEncoder = require('firebase-encode');

function getDataFireBase(ref, user, obj, fieldName) {
    return new Promise((resolved, rejected) => {
        ref
            .child(obj)
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
