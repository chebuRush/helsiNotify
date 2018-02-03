const getDoctorsListFromDB = require('./getDoctorsListFromDB');
const visit = require('./visitDoctor');
const DomParser = require('dom-parser');

async function main() {
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const doc = await instance.createPage();
    const docList = await getDoctorsListFromDB();
    for (const docSite in docList) {
        const result = visit(doc, docSite);
    }
    await instance.exit();
}

main();
module.exports = main;
