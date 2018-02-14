// 404 no found
module.exports.notFound = res =>
    res.json({
        statusHelsiCode: '404'
    });

// 200 ok
module.exports.sendOK = (res, additionalData) => {
    if (additionalData) {
        res.json({
            statusHelsiCode: '200',
            usefulData: additionalData
        });
    } else {
        res.json({
            statusHelsiCode: '200'
        });
    }
};

// 403 forbidden
module.exports.forbidden = (res, errorMsg) => {
    if (errorMsg) {
        res.json({
            errorHelsiMsg: errorMsg,
            statusHelsiCode: '403'
        });
    } else {
        res.json({
            statusHelsiCode: '403'
        });
    }
};

module.exports.wrongAuth = (res, errorMsg) => {
    if (errorMsg) {
        res.json({
            errorHelsiMsg: errorMsg,
            statusHelsiCode: '403'
        });
    } else {
        res.json({
            statusHelsiCode: '403'
        });
    }
};

module.exports.wrongParams = (res, errorMsg) => {
    if (errorMsg) {
        res.json({
            errorHelsiMsg: errorMsg,
            statusHelsiCode: '400'
        });
    } else {
        res.json({
            statusHelsiCode: '400'
        });
    }
};
