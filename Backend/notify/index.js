const getDoctorsListFromDB = require('./getDoctorsListFromDB');
const visitDoctor = require('./visitDoctor');
const deleteUnvalidLink = require('./deleteUnvalidLink');
const phantom = require('phantom');

async function WorkWithSeparateLink(doc, theArray) {
    const results = [];
    for (const entry of theArray) {
        try {
            results.push(await visitDoctor(doc, entry));
        } catch (e) {
            deleteUnvalidLink(entry);
        }
    }
    return results;
}

async function main() {
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const doc = await instance.createPage();
    const docList = await getDoctorsListFromDB();
    WorkWithSeparateLink(doc, Object.keys(docList)).then(results => {
        console.log('Results:', results);
    });
}

main();
module.exports = main;
