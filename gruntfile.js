module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
		jshint: {
			files: {
				src: ['dist/mindmap.js']
			}
		},
		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			scripts: {
				files: ['dist/**/*.js', 'index.html', 'dist/**/*.css', 'jquery.zoomooz.js'],
				tasks: ['jshint'],
			}
		},
		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: 3000,
					base: '',
					livereload: true,
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['connect', 'watch']);
}