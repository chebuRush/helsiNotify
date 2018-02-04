const setDataFireBase = require('./setDataFireBase');
const updateDataFireBase = require('./updateDataFireBase');
const deleteDataFireBase = require('./deleteDataFireBase');
const getDataFireBase = require('./getDataFireBase');
const updateDataViaPushFireBase = require('./updateDataViaPushFireBase');
const updateSensitiveData = require('./transactionMoney');

const currentRefConst = 'HelsiNotify';

function Database(firebase) {
    const ref = firebase.database().ref(currentRefConst);
    return {
        setData(child, obj) {
            return setDataFireBase(ref, child, obj);
        },
        updateData(child, obj, callbackObj) {
            return updateDataFireBase(ref, child, obj, callbackObj);
        },
        updateDataViaPush(path, link, uid) {
            return updateDataViaPushFireBase(ref, path, link, uid);
        },
        deleteData(child, path) {
            return deleteDataFireBase(ref, child, path);
        },
        getData(user, getObj, usefullDataVariable, additionalPathToBeDecoded) {
            return getDataFireBase(ref, user, getObj, usefullDataVariable, additionalPathToBeDecoded);
        },
        updateSensitiveData(uid, workWithMoneyFunction) {
            return updateSensitiveData(ref, uid, workWithMoneyFunction);
        }
    };
}

module.exports = Database;
