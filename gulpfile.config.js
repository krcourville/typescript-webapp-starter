var cfg = {
    outputPath: './dist',
    outfiles: {
        appjs: 'app.js',
        vendorjs: 'vendor.js',
        appcss: 'app.css'
    },
    ts: {
        files: [
            './typings/index.d.ts',
            './app/index.ts'
        ]
    },
    html: {
        index: './app/index.html'
    },
    templates: [
        './app/**/*.html',
        '!./app/index.html'
    ],
    sass: './app/**/*.scss',
    vendor: {
        js: [
            './node_modules/angular/angular.js',
            './node_modules/angular-animate/angular-animate.js',
            './node_modules/angular-aria/angular-aria.js',
            './node_modules/angular-material/angular-material.js',
        ]
    }
};

module.exports = cfg;