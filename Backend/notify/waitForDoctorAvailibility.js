const phantom = require('phantom');
const DomParser = require('dom-parser');
const sendEmail = require('./NotifyUserViaEmailSMS');

async function searchDoctor(doctorName) {
    const link = '';
    const instance = await phantom.create();
    const page = await instance.createPage();

    const searchLink = `https://helsi.me/find/?name=${encodeURI(doctorName)}&searchMode=name`;
    const status = await page.open(searchLink);
    await timeout(1000);
    const content = await page.property('content');
    return await findLink(content);
}

async function testDoc(link) {
    const instance = await phantom.create();
    const doc = await instance.createPage();
    const status = await doc.open(link);
    await timeout(2000);
    const content = await doc.property('content');
    return await !~content.indexOf('Здається, щось пішло не так.');
}

async function doctorAvailability(link, notifyObj) {
    const instance = await phantom.create();
    const doc = await instance.createPage();
    const status = await doc.open(link);
    await timeout(2000);
    const content = await doc.property('content');
    if (~content.indexOf('місц')) {
        await sendEmail(notifyObj.email, link);
        await instance.exit();
    } else {
        await instance.exit();
        await timeout(60000);
        doctorAvailability(link, notifyObj);
    }
}

function findLink(html) {
    return new Promise((resolve, reject) => {
        const parser = new DomParser();
        const dom = parser.parseFromString(html);
        let ParticularHtml;
        try {
            ParticularHtml = dom.getElementsByClassName('doctor-card__wrapper doctor-card__wrapper_link')[0].outerHTML;
        } catch (e) {
            reject(new Error('No match after search! Try again'));
        }
        const hrefStart = ParticularHtml.indexOf('href') + 6;
        const NeededLink = `https://helsi.me${ParticularHtml.slice(hrefStart, ParticularHtml.indexOf('"', hrefStart))}`;
        resolve(NeededLink);
    });
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.doctorAvailability = doctorAvailability;
module.exports.testDoc = testDoc;
