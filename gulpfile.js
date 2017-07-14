var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var util        = require('gulp-util');
var historyApiFallback = require('connect-history-api-fallback');

var ignoreErrors = true;

var bundler = browserify({
    entries      : ['app/app.js'],
    transform    : ['babelify'],
    debug        : true,
    insertGlobals: true,
    fullPaths    : true,
});

gulp.task('scripts', function(cb) {
    function logBrowserifyError(err) {
        console.log(err.message);
        if(err.codeFrame) {
            console.log('==============');
            console.log(err.codeFrame);
            console.log('==============');
        }
    }

    function onErrorIgnore(err) {
        logBrowserifyError(err);
        if (cb) {cb(); cb = null}
    }

    function onError(err) {
        logBrowserifyError(err);
        process.exit(1);
    }

    return bundler
        .bundle()
        .on('log', util.log)
        .on('error', ignoreErrors ? onErrorIgnore : onError)
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('index', function() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
    return gulp.src(['app/**/*.html', '!app/index.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
    return gulp.src('app/**/*.css')
        .pipe(gulp.dest('dist/'))
});

gulp.task('vendors', function() {
    return gulp.src('vendor/**/*.*')
        .pipe(gulp.dest('dist/vendor'))
});

gulp.task('watch', ['build'], function() {
    browserSync({
        port     : 8080,
        open     : true,
        ui       : false,
        notify   : false,
        ghostMode: false,
        logPrefix: 'BS',
        logLevel : 'silent',
        server   : {
            baseDir: 'dist',
            middleware: [ historyApiFallback() ]
        },
    });

    gulp.watch('app/index.html', ['index']);
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/**/*.css', ['styles']);
    gulp.watch(['app/**/*.html', '!app/index.html'], ['html']);
    gulp.watch('dist/**/*.*', browserSync.reload);
});

gulp.task('build', ['scripts', 'index', 'styles', 'html', 'vendors']);
gulp.task('default', function() {
    ignoreErrors = false;
    return gulp.start('build');
});