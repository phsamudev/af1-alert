const yargs = require('yargs');

function getConfig() {
    return yargs
        .option('size', {
            alias: 's',
            description: 'Define which size should the program look for availability',
            type: 'number',
        })
        .option('email', {
            alias: 'e',
            description: 'Define the email address to be used by the gmail smtp',
            type: 'string',
        })
        .option('password', {
            alias: 'p',
            description: 'Define the password to be used by the gmail smtp',
            type: 'string',
        })
        .option('alert', {
            alias: 'a',
            description: 'Define the email address which will be alerted in case of availability',
            type: 'string',
        })
        .option('minutes', {
            alias: 'm',
            description: 'Define the interval between each request made in minutes',
            type: 'number',
        })
        .demandOption(['size', 'email', 'password', 'alert', 'minutes'], 'Please provide size, smtp email, smtp password, alert address and interval in order to this to work.')
        .help()
        .alias('help', 'h')
        .argv;
}

exports.getConfig = getConfig;