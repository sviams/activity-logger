module.exports = function(config){
    config.set({
        basePath : '../',

        preprocessors: {
            'public/js/**/*.js' : 'coverage'
        },

        files : [
          'bower_components/angular/angular.js',
          'bower_components/angular-resource/angular-resource.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-bootstrap/ui-bootstrap.js',
          'test/lib/angular/angular-mocks.js',
          'public/js/**/*.js',
          'test/unit/client/**/*.js'
        ],

        exclude: ['bower_components/angular-scenario/angular-scenario.js'],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
          'karma-coverage',
          'karma-junit-reporter',
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine',
          'karma-spec-reporter'
        ],

        junitReporter : {
          outputFile: 'test_out/unit.xml',
          suite: 'unit'
        },

        reporters: ['coverage', 'spec'],

        coverageReporter: {
            type: 'html',
            dir: 'coverage'
        }

})}
