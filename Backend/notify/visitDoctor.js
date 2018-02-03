const phantom = require('phantom');
const cheerio = require('cheerio');
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDateInFormat(dt) {
    return `${dt.getFullYear()}-${dt.getMonth() + 1 < 10 ? `0${dt.getMonth() + 1}` : dt.getMonth() + 1}-${dt.getDate() < 10 ? `0${dt.getDate()}` : dt.getDate()}`;
}

async function visitDoctor(link) {
    console.time('start');
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const doc = await instance.createPage();
    await doc.open(link);
    await timeout(1000);
    let html = await doc.property('content');
    const $ = cheerio.load(html);
    arr = {};
    let dt = new Date();
    $('.schedule__day').each((i,elem)=>{
        arr[getDateInFormat(dt)] = $(elem).find('.schedule__range-count').text();
        dt.setDate(dt.getDate() + 1);
    });
    console.log(arr);
    await instance.exit();
    console.timeEnd('start');
    // if (~content.indexOf('місц')) {
    //     await sendEmail(notifyObj.email, link);
    // } else {
    //     await instance.exit();
    //     await timeout(60000);
    //     doctorAvailability(link, notifyObj);
    // }
}

visitDoctor('https://helsi.me/doctor/shv_20');

module.exports = visitDoctor;
