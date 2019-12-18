const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const datetime = require('node-datetime');
const argscfg = require('./args-config');


const args = argscfg.getConfig();

const nikeUrl = "https://www.nike.com.br/Produto/Tenis-Nike-Air-Force-1-07-Masculino/153-169-172-25917?site_id=106";
const size = args.size;
const smtpAddress = args.email;
const smtpPass = args.password;
const toAddress = args.alert;
const intervalMinutes = args.minutes;

console.log('Started.');
getNike();
const interval = setInterval(() => {
    getNike();
}, 60000 * intervalMinutes);

function sendMail() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: smtpAddress,
            pass: smtpPass
        }
    });
    const mailOptions = {
        from: smtpAddress,
        to: toAddress,
        subject: '[Alert] Nike AF1',
        text: 'The product is available!'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function getNike() {
    try {
        const response = await axios.get(nikeUrl);
        if (response && response.status === 200) {
            const $ = cheerio.load(response.data);
            const hasProduct = $(`li.tamanho-desabilitado > input#tamanho__id${size}`).length === 0;
            if (hasProduct) {
                const dt = datetime.create().format('H:M:S d/m/Y');
                console.log(`Available (${dt})`);
                sendMail();
                clearInterval(interval);
            }
            else {
                const dt = datetime.create().format('H:M:S d/m/Y');
                console.log(`Unavailable (${dt})`);
            }
        }
    } catch (error) {
        console.error(error);
    }
}