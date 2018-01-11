"use strict";

const testDoc = require('./waitForDoctorAvailibility').testDoc;
const docAvailibility = require('./waitForDoctorAvailibility').doctorAvailability;
const https = require('https');


module.exports = function (app) {

    let obj = [
    ];

    app.get("/", function(req, res){
        res.sendFile('index.html');
    });

    app.post("/send", (req, res)=>{
        const {doc:doctorLink, email} = req.body;
        sendDataBack(doctorLink, email, obj, res)
    });

};

async function sendDataBack(doctorLink,email,obj,res){
     if(await testDoc(doctorLink)){
         obj.push({
             'docLink': doctorLink,
             'email': email,
             'status': 'Waiting'
         });
         console.log(obj);
         res.statusCode=200;
         res.end();
         docAvailibility(doctorLink,{email});
         for (let i = 0; i < obj.length; i++) {
             if (obj[i].docLink === doctorLink && obj[i].email === email){
                 obj[i].status='Completed';
                 break;
             }
         }
     } else {
         res.end('Check link. It might be wrong');
     }
}


