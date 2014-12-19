/** 
 *  configuration for build production version
 *  NOTE: for run production build execute command $node r.js -o build_one_file.js
 */
({
    baseUrl: "./js/spi",
    mainConfigFile: "./js/main.config.js",
    paths: {
        'page': 'management'
    },
    CoffeeScript: {
        bare: true
    },
    exclude: ['coffee-script'],
    stubModules: ['text', 'cs'],
    findNestedDependencies: true,
    name: '../bootstrap_app',
    include: [ '../main.config' ],
    //wrap: false,
    wrap: {
        startFile: "built/start.frag",
        endFile: "built/end.frag"
    },
      out: './../assets/js/spa/management.js'
   // out: './js/spa/management.js'
    , optimize: 'none'
    , uglify2: {
        'screw-ie8': true,
        compress: {
            global_defs: {
                DEBUG: false
            }
        },
        warnings: false,
        // Safe here, probably due to implicit declarations in r.js
        mangle: true
    }
})
