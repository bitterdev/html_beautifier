var packageName = "html_beautifier";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        version: {
            php: {
                options: {
                    pkg: {
                        version: function () {
                            var s = grunt.file.read('controller.php');
                            var re = /\$pkgVersion[\s*]=[\s*][\'|\"](.*)[\'|\"]/g
                            var m = re.exec(s);

                            if (m.length) {
                                return m[1];
                            }

                            return false;
                        }()
                    },
                    prefix: '@version\\s*'
                },
                src: [
                    'dist/*.php', 'dist/**/*.php', 'dist/**/**/*.php', 'dist/**/**/**/*.php', 'dist/**/**/**/**/*.php'
                ]
            }
        },
        composer: {
            options: {
                usePhp: true,
                composerLocation: './node_modules/getcomposer/composer.phar'
            },
            dev: {
                options: {
                    flags: ['ignore-platform-reqs']
                }
            },
            release: {
                options: {
                    flags: ['no-dev']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {src: ['vendor/**'], dest: "dist/"},
                    {src: ['controller.php'], dest: "dist/", filter: 'isFile'},
                    {src: ['icon.png'], dest: "dist/", filter: 'isFile'},
                    {src: ['INSTALL.TXT'], dest: "dist/", filter: 'isFile'},
                    {src: ['LICENSE.TXT'], dest: "dist/", filter: 'isFile'},
                    {src: ['CHANGELOG'], dest: "dist/", filter: 'isFile'}
                ]
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'release/' + packageName + '.zip'
                },
                files: [
                    {src: ['**'], dest: packageName, expand: true, cwd: 'dist/'}
                ]
            }
        },
        clean: {
            dist: ['dist'],
            composer: ['vendor', 'composer.lock']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-composer');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['clean:dist', 'copy', 'version', 'clean:composer', 'composer:dev:install', 'compress:main', 'clean:dist']);
};
