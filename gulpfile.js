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

    debug = true
    ;

var cfg = {
    distroot: './dist'
};

gulp.task('default', ['build']);

gulp.task('build', ['copy', 'vendor-js', 'app-js']);

gulp.task('copy', function () {
    return gulp
        .src('./src/index.html')
        .pipe(gulp.dest(cfg.distroot));
});


gulp.task('less', function () {
    // content
});

gulp.task('vendor-js', function () {
    var files = [
        './node_modules/angular/angular.js'
    ];

    return gulp.src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(cfg.distroot));
});

gulp.task('app-js', function () {
    var tsProject = ts.createProject(__dirname + '/tsconfig.json', {
        sortOutput: true,
        noExternalResolve: true
    });
    var tsFiles = [
        './src/app.ts',
        './typings/index.d.ts'
    ];
    var b = browserify(tsFiles, {
            debug: true,
            loadMaps: true
        })
        .plugin(tsify, {
            target: 'es6'
        })
        .transform(babelify, {
            plugins: ['transform-runtime'],
            presets: ['es2015'],
            extensions: ['*.ts']
        });

    return b.bundle()
        .on('error', gutil.log)
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cfg.distroot));

    // return gulp.src(files, { base: "./" })
    //     .pipe(ts(tsProject))
    //     .pipe(babel({
    //         plugins: ['transform-runtime'],
    //         presets: ['es2015']
    //     }))
    //     .pipe(browserify())
    //     .pipe(concat('app.js'))
    //     .pipe(gulp.dest(cfg.distroot));
});

function onError(err) {
    console.error(err.toString());
}