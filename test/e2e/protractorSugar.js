'use strict';

module.exports = function(ptor) {

    var obj = {};

    obj.getElementById = function(id) {
        return ptor.findElement(protractor.By.id(id));
    };

    obj.clickById = function(id) {
        this.getElementById(id).click();
    };

    obj.setInputValueById = function(id, value) {
        var input = this.getElementById(id);
        input.clear();
        input.sendKeys(value);
    };

    return obj;
};
