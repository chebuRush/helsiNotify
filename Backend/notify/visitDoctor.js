
const memwatch = require('memwatch-next');

async function visitDoctor(doc, link) {

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getDateInFormat(dt) {
        return `${dt.getFullYear()}-${dt.getMonth() + 1 < 10 ? `0${dt.getMonth() + 1}` : dt.getMonth() + 1}-${dt.getDate() < 10 ? `0${dt.getDate()}` : dt.getDate()}`;
    }
    let hd = new memwatch.HeapDiff();
    await doc.open(link);
    let data = hd.end();
    console.log('docOpen HeapDiff\n\n', data);
    let dt = new Date();
    await timeout(1000);
    let html = await doc.property('content');
    const $ = require('cheerio').load(html);
    if ($('.not-find-page__title').text() === '404') {
        throw new Error('Invalid doctor link');
    }
    if ( $('.schedule__title-date').text().slice(0,2) > (dt.getDate()+1<10 ? '0'+(dt.getDate()+1) : dt.getDate()+1) ) {
        dt.setDate(dt.getDate()-1);
    }
    let schedulePlaces = {};
    $('.schedule__day').each((i,elem)=>{
        schedulePlaces[getDateInFormat(dt)] = $(elem).find('.schedule__range-count').text();
        dt.setDate(dt.getDate() + 1);
    });
    await doc.clearCookies();

    return schedulePlaces;
}

async function checkAvailability(schedule){
    if (schedule){
        return Object.keys(schedule).filter(key =>  schedule[key].indexOf('місц') !== -1);
    } else {
        return []
    }
}

module.exports.visitDoctor = visitDoctor;
module.exports.checkAvailability = checkAvailability;
