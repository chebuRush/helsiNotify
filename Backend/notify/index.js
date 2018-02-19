const getDoctorsListFromDB = require('./getDoctorsListFromDB');
const visitDoctorPage = require('./visitDoctor').visitDoctor;
const checkAvailability = require('./visitDoctor').checkAvailability;
const deleteUnvalidLink = require('./deleteUnvalidLink');
const memwatch = require('memwatch-next');
const notifyUsersAndGetMoney = require('./notifyUsersAndGetMoney');
const phantom = require('phantom');

async function WorkWithSeparateDoctor(doc, theArray) {
    for (const entry of theArray) {
        let schedule;
        try {
            const hd = new memwatch.HeapDiff();
            schedule = await visitDoctorPage(doc, entry);
            const diff = hd.end();
            console.log('HeapDiff | visitDoctorPage: \n', diff);
        } catch (e) {
            if (e.message === 'Invalid doctor link') {
                deleteUnvalidLink(entry);
            } else {
                console.error(e.message);
                throw e;
            }
        }
        const arrayOfDates = await checkAvailability(schedule);
        if (arrayOfDates) {
            await notifyUsersAndGetMoney(entry, arrayOfDates);
        }
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const doc = await instance.createPage();
    let docList = await getDoctorsListFromDB();
    Promise.resolve()
        .then(async function resolver() {
            if (docList) {
                const hd = new memwatch.HeapDiff();
                return WorkWithSeparateDoctor(doc, Object.keys(docList))
                    .then(async () => {
                        docList = await getDoctorsListFromDB();
                        await doc.clearCookies();
                        const diff = hd.end();
                        console.log('HeapDiff | WorkWithSeparateDoctor: \n', diff);
                        await timeout(60000);
                    })
                    .then(resolver);
            }
            return timeout(60000)
                .then(async () => {
                    docList = await getDoctorsListFromDB();
                })
                .then(resolver);
        })
        .catch(async e => {
            console.error(e);
            await instance.exit();
        });
}

module.exports = main;
