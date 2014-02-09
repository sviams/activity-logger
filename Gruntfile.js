module.exports = function(grunt) {
    'use strict';

    var dateFormat = require('dateformat');

    var reportDir = 'build/reports/' + dateFormat(new Date(), 'yyyymmdd-HHMMss');

    // Project configuration.
    grunt.initConfig({
        jasmine_node: {
            coverage: {},
            options: {
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                specFolders: ['./test/unit/server'],
                projectRoot: '',
                junitreport: {
                    report: false,
                    savePath: './build/reports/jasmine',
                    useDotNotation: false,
                    consolidate: true
                }
            }
        },
        karma: {
            unit: {
                configFile: './config/karma.conf.js',
                singleRun: true
            }
        },
        protractor: {
            options: {
                configFile: './node_modules/protractor/referenceConf.js',
                keepAlive: true,
                args: {}
            },
            activity_logger: {
                configFile: './config/protractor-e2e.conf.js'
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'private/**/*.js',
                'test/unit/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        coverage: {
            options: {
                thresholds: {
                    'statements': 90,
                    'branches': 90,
                    'lines': 90,
                    'functions': 90
                },
                dir: 'coverage'
            }
        },
        clean: ['coverage']
    });

    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-istanbul-coverage');

    grunt.registerTask('all', ['clean', 'jshint', 'jasmine_node', 'karma', 'protractor', 'coverage']);

    grunt.registerTask('default', ['all']);

};