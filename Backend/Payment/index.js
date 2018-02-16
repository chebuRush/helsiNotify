const iconv = require('iconv-lite');
const crypto = require('crypto');
const config = require('config');

const key = config.get('Payment.secretKey');

const comparator = function comp(a, b) {
    const aToLower = a.toLowerCase();
    const bToLower = b.toLowerCase();
    return aToLower > bToLower ? 1 : aToLower < bToLower ? -1 : 0;
};

function encodeFormPay(amountOfMoney, uid) {
    function getOneYearGap(dt) {
        return `${dt.getFullYear() + 1}-${dt.getMonth() + 1 < 10 ? `0${dt.getMonth() + 1}` : dt.getMonth() + 1}-${dt.getDate() < 10 ? `0${dt.getDate()}` : dt.getDate()}T23:59:59`;
    }

    const fields = {
        WMI_MERCHANT_ID: config.get('Payment.MerchantId'),
        WMI_PAYMENT_AMOUNT: amountOfMoney,
        WMI_CURRENCY_ID: '980',
        WMI_PAYMENT_NO: Math.round(Math.random() * Number.MAX_SAFE_INTEGER),
        WMI_DESCRIPTION: `BASE64:${new Buffer(`Payment for user ${uid} in Helsi-Notify`).toString('base64')}`,
        WMI_EXPIRED_DATE: getOneYearGap(new Date()),
        WMI_PTENABLED: ['CreditCardUAH', 'Privat24UAH', 'WalletOneUAH'],
        WMI_SUCCESS_URL: `https://helsi-notify.tk/user/${uid}/settings`,
        WMI_FAIL_URL: `https://helsi-notify.tk/user/${uid}/settings`,
        TransactionUserId: uid
    };

    const createInput = function(name, value) {
        return `<input name="${name}" value="${value}">`;
    };

    let inputs = '';
    let values = '';

    // Формирование сообщения, путем объединения значений формы,
    // отсортированных по именам ключей в порядке возрастания
    Object.keys(fields).sort(comparator).forEach(name => {
        const value = fields[name];
        if (Array.isArray(value)) {
            values += value.sort(comparator).join('');
            inputs += value.map(val => createInput(name, val)).join('');
        } else {
            values += value;
            inputs += createInput(name, value);
        }
    });

    // Формирование значения параметра WMI_SIGNATURE, путем
    // вычисления отпечатка, сформированного выше сообщения,
    // по алгоритму MD5 и представление его в Base64
    inputs += createInput(
        'WMI_SIGNATURE',
        crypto.createHash('md5').update(iconv.encode(values + key, 'win1251')).digest('base64')
    );

    // Формирование HTML-кода платежной формы.
    return `<form method="POST" id="PayFormHTML" action="https://wl.walletone.com/checkout/checkout/Index" accept-charset="UTF-8">${inputs}<input type="submit"></form>`;
}

function checkStateAndSignature(params) {
    let values = '';

    // Формирование сообщения, путем объединения значений формы,
    // отсортированных по именам ключей в порядке возрастания
    Object.keys(params).sort(comparator).forEach(name => {
        if (name !== 'WMI_SIGNATURE') values += params[name];
    });

    const WMI_SIGNATURE = crypto.createHash('md5').update(iconv.encode(values + key, 'win1251')).digest('base64');

    return WMI_SIGNATURE === params.WMI_SIGNATURE && params.WMI_ORDER_STATE.toUpperCase() === 'ACCEPTED';
}

module.exports.checkStateAndSignature = checkStateAndSignature;
module.exports.encodeFormPay = encodeFormPay;
