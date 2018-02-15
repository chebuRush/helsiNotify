function setDataFireBase(ref, child, obj) {
    return new Promise((resolve, reject) => {
        ref
            .child(`${child}`)
            .set(obj)
            .then(() => resolve())
            .catch(error => reject(new Error(`Something has happened with setDataFireBase: ${error.message}`)));
    });
}

module.exports = setDataFireBase;
