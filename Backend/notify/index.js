const getDoctorsListFromDB = require('./getDoctorsListFromDB');
const visitDoctorPage = require('./visitDoctor').visitDoctor;
const checkAvailability = require('./visitDoctor').checkAvailability;
const deleteUnvalidLink = require('./deleteUnvalidLink');
const notifyUsersAndGetMoney = require('./notifyUsersAndGetMoney');
const phantom = require('phantom');
const heapDump = require('heapdump');

async function WorkWithSeparateDoctor(doc, listOfDoctors) {
    for (let i = listOfDoctors.length; i >= 0; i -= 1) {
        try {
            const schedule = await visitDoctorPage(doc, listOfDoctors[i]);
            const arrayOfDates = await checkAvailability(schedule);
            if (arrayOfDates && listOfDoctors[i]) {
                await notifyUsersAndGetMoney(listOfDoctors[i], arrayOfDates);
            }
        } catch (e) {
            if (e.message === 'Invalid doctor link') {
                deleteUnvalidLink(listOfDoctors[i]);
            } else {
                console.error(e.message);
                throw e;
            }
        }
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    let instance = await phantom.create([
        '--ignore-ssl-errors=yes',
        '--load-images=no',
        '--disk-cache=no',
        '--max-disk-cache-size=1000'
    ]);
    let i = 0;
    let doc = await instance.createPage();
    let docList = await getDoctorsListFromDB();
    Promise.resolve()
        .then(async function resolver() {
            if (docList) {
                return WorkWithSeparateDoctor(doc, Object.keys(docList))
                    .then(async () => {
                        i += 1;
                        docList = await getDoctorsListFromDB();
                        if (i >= 10) {
                            await instance.exit();
                            instance = await phantom.create([
                                '--ignore-ssl-errors=yes',
                                '--load-images=no',
                                '--disk-cache=no',
                                '--max-disk-cache-size=1000'
                            ]);
                            doc = await instance.createPage();
                            i = 0;
                            await timeout(40000);
                        } else {
                            await timeout(60000);
                        }
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
