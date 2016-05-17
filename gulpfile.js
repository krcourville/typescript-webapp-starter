require('es6-shim');

'use strict';

var
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),    
    browserSync = require('browser-sync').create(),
    templateCache = require('gulp-angular-templatecache'),
    runSequence = require("run-sequence"),
    del = require("del"),
    watchify = require('watchify'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    fs = require('fs'),
    path = require('path'),

    debug = true,
    isWatching = false
    ;

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

gulp.task('default', ['cleanbuild']);

gulp.task('build', ['copy', 'sass', 'vendor-js', 'templates', 'app-js']);

gulp.task('clean', function () {
    return del([cfg.outputPath]);
});

gulp.task('cleanbuild', function (done) {
    runSequence('clean', 'build', done);
});

gulp.task('copy', function () {
    return gulp
        .src(cfg.html.index)
        .pipe(gulp.dest(cfg.outputPath));
});

gulp.task('templates', function () {
    return gulp.src(cfg.templates)
        .pipe(templateCache({
            module: 'app',
            transformUrl: function(urlIn){                
                return path
                    .basename(urlIn)
                    .toLowerCase();
            }
        }))
        .pipe(gulp.dest(cfg.outputPath));
});

gulp.task('watch', ['browsersync'], function () {
    gulp.watch(cfg.html.index, ['copy']);
    gulp.watch(cfg.sass, ['sass']);
    gulp.watch(cfg.templates, ['templates']);

    var distfiles = [
        './dist/*.js',
        './dist/*.html'
    ];

    gulp.watch(distfiles).on('change', function () {
        console.log('Dist files modified');
        browserSync.reload();
    });
});

gulp.task('serve', function () {
    isWatching = true;

    runSequence(
        'cleanbuild',
        'watch'
    );
});

gulp.task('browsersync', function () {
    browserSync.init({
        server: {
            baseDir: cfg.outputPath
        }
    });
});

gulp.task('sass', function () {
    var stream = gulp.src(cfg.sass)
        .pipe(sourcemaps.init())
        .on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        })
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cfg.outputPath));

    if (isWatching) {
        stream = stream.pipe(browserSync.stream());
    }
    return stream;
});

gulp.task('vendor-js', function () {
    checkfiles(cfg.vendor.js);

    return gulp.src(cfg.vendor.js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cfg.outputPath));
});

gulp.task('app-js', function () {
    var browserifyOptions = {
        debug: true,
        loadMaps: true,
        sortOutput: true,
        noExternalResolve: true
    };

    var b = browserify(cfg.ts.files, browserifyOptions)
        .plugin(tsify, {
            target: 'es5'
        });

    if (isWatching) {
        b = watchify(b);
        b.on('update', bundle);
        b.on('log', gutil.log);
    }

    return bundle();

    function bundle() {
        return b.bundle()
            .on('error', gutil.log)
            .pipe(source(cfg.outfiles.appjs))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(cfg.outputPath));
    }
});

function onError(err) {
    console.error(err.toString());
}

function checkfiles(files) {
    files.forEach(function (file) {
        if (!fs.existsSync(file)) {
            console.warn('Source file not found: ', file);
        }
    });
}