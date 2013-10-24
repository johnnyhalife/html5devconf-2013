module.exports = function(grunt) {
	grunt.initConfig({
		clean: ['./dist'],
		copy: {
			release: {
				files: [ { src: './**', dest: './dist/' } ]
			}
		},
		cssmin: {
			combine: {
				files: {
					'./dist/static/css/compiled.css': './static/css/main.css'
				}
			}
		},
		version: {
			release: {
				buildNumber: (process.env.BUILD_NUMBER || '42')
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			js: {
				files: {
					'./dist/static/js/client.js' : ['./static/js/jquery.min.js', './static/js/function.js', './static/js/main.js']
				}
			}
		},
		htmlrefs: {
			views: {
				src: './views/*.html',
				dest: './dist/views'
			}
		},
		revmd5: {
			options: {
				relativePath: './dist',
				safe: true
			},
			files: {
				src: './dist/views/*.html'
			}
		},
		cdn: {
			options: {
				cdn: '//s3.amazonaws.com/html5devconf/'
			},
			views: {
				src: './dist/views/*.html'
			}
		},
		's3-sync': {
				options: {
					key: process.env.AWS_ACCESS_KEY,
					secret: process.env.AWS_ACCESS_SECRET,
					bucket: 'html5devconf',
					headers: {
						'Cache-Control': 'max-age=31536000'
					}
				},
				text: {
					options: {
						compressionLevel: 9,
						gzip: true
					},
					files: [
					{
						root: 'dist/',
						src: ['dist/static/js/client.js', 'dist/static/js/html5.js', 'dist/static/css/compiled.css'],
						dest: '/',
					}]
				},
				images: {
					files: [
					{
						root: 'dist/',
						src: ['dist/static/images/*', 'dist/static/favicon.ico'],
						dest: '/',
						gzip: false
					}]
				}
		}
	});

	grunt.registerMultiTask('version', 'Add build number to the package.json', function() {
		var package = JSON.parse(grunt.file.read('./package.json'));
		var version = package.version.split('.');
		version[2] = this.data.buildNumber;
	
		package.version = version.join('.');
	
		grunt.file.write('./dist/package.json', JSON.stringify(package, null, 2));
	});

	grunt.registerTask('release', ['clean',
		'copy',
		'version',
		'cssmin',
		'uglify',
		'htmlrefs',
		'revmd5',
		'cdn',
		's3-sync']);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-htmlrefs');
	grunt.loadNpmTasks('grunt-rev-md5');
	grunt.loadNpmTasks('grunt-cdn');
	grunt.loadNpmTasks('grunt-s3-sync');
};