'use strict';

var protractorSugar = require('./protractorSugar');

describe('ActivityLogger app', function() {

    it('should redirect / to /login when not logged in', function() {
        browser.get('/');
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/login');
    });

    it('should redirect to /login from /admin if not logged in', function() {
        browser.get('/admin');
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/login');
    });

    it('should redirect to /login from /users if not logged in', function() {
        browser.get('/users');
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/login');
    });

    describe('when logged in as admin', function() {
        var ps;

        beforeEach(function() {
            ps = protractorSugar(browser);
            browser.get('login');
            ps.setInputValueById('username', 'admin');
            ps.setInputValueById('password', 'changeme');
            ps.clickById('login');
        });

        afterEach(function() {
            browser.get('/logout');
        });

        it('should arrive at / after successful login', function() {
            expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/');
        });

        it('should be possible to load /admin', function() {
            browser.get('/admin');
            expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/admin');
        });

    });

});
