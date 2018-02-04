const getDoctorsListFromDB = require('./getDoctorsListFromDB');
const visitDoctorPage = require('./visitDoctor').visitDoctor;
const checkAvailability = require('./visitDoctor').checkAvailability;
const deleteUnvalidLink = require('./deleteUnvalidLink');
// const notifyUsersAndGetMoney = require('./notifyUsersAndGetMoney');
const phantom = require('phantom');

async function WorkWithSeparateDoctor(doc, theArray) {
    const results = [];
    for (const entry of theArray) {
        let schedule;
        try {
            schedule = await visitDoctorPage(doc, entry);
        } catch (e) {
            deleteUnvalidLink(entry);
        }
        const arrayOfDates = await checkAvailability(schedule);
        console.log(arrayOfDates);
        // if (arrayOfDates) {
        //     await notifyUsersAndGetMoney(link);
        // }
    }
    return results;
}

async function main() {
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const doc = await instance.createPage();
    const docList = await getDoctorsListFromDB();
    WorkWithSeparateDoctor(doc, Object.keys(docList)).then(async results => {
        console.log('Results:', results);
        await instance.exit();
    });
}

main();
module.exports = main;
