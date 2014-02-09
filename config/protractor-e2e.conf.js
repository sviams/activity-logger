'use strict';

exports.config = {
    seleniumServerJar: '../selenium/selenium-server-standalone-2.35.0.jar',
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:3000',
    chromeDriver: '../node_modules/chromedriver/bin/chromedriver',
    capabilities: {
        'browserName': 'chrome'
    },
    specs: ['../test/e2e/main_e2e_spec.js'],
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
