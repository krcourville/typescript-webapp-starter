'use strict';

var
    gulp = require('gulp'),
    ts = require('gulp-typescript'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),
    babelify = require('babelify'),
    browserSync = require('browser-sync').create(),
    runSequence = require("run-sequence"),
    del = require("del"),
    watchify = require('watchify'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),

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
    sass: './app/**/*.scss',
    vendor: {
        js: [
            './node_modules/angular/angular.js'
        ]
    }
};

gulp.task('default', ['cleanbuild']);

gulp.task('build', ['copy', 'sass', 'vendor-js', 'app-js']);

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

gulp.task('watch', ['browsersync'], function () {
    gulp.watch(cfg.html.index, ['copy']);
    gulp.watch(cfg.sass, ['sass']);

    var distfiles = [
        './dist/*.[js|html]'
    ];

    gulp.watch(distfiles).on('change', browserSync.reload);
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
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cfg.outputPath));

    if (isWatching) {
        stream = stream.pipe(browserSync.stream());
    }
    return stream;
});

gulp.task('vendor-js', function () {
    return gulp.src(cfg.vendor.js)
        .pipe(concat('vendor.js'))
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