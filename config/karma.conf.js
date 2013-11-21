module.exports = function(config){
    config.set({
        basePath : '../',

        preprocessors: {
            'public/js/**/*.js' : 'coverage'
        },

        files : [
          'bower_components/angular/angular.js',
          'bower_components/angular-resource/angular-resource.js',
          'test/lib/angular/angular-mocks.js',
          'public/js/**/*.js',
          'test/unit/client/**/*.js'
        ],

        exclude: ['public/js/lib/angular/angular-scenario.js'],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
          'karma-coverage',
          'karma-junit-reporter',
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine'
        ],

        junitReporter : {
          outputFile: 'test_out/unit.xml',
          suite: 'unit'
        },

        reporters: ['coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'coverage'
        }

})}
