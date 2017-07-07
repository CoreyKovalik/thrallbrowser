var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var util        = require('gulp-util');

var bundler = browserify({
    entries      : ['app/src/app.js'],
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

    function onError(err) {
        logBrowserifyError(err);
        if (cb) {cb(); cb = null}
    }

    bundler
        .bundle()
        .on('log', util.log)
        .on('error', onError)
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('index', function() {
    gulp.src('app/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
    gulp.src('app/styles/**.css')
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('watch', [
    'index',
    'styles',
    'scripts'], function() {
    browserSync({
        port     : 8080,
        open     : true,
        ui       : false,
        notify   : false,
        ghostMode: false,
        logPrefix: 'BS',
        logLevel : 'silent',
        server   : {baseDir: 'dist'},
    });

    gulp.watch('app/index.html', ['index']);
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/**/*.css', ['styles']);
    gulp.watch('dist/**/*.*', browserSync.reload);
});

gulp.task('build', ['scripts', 'index', 'styles']);
gulp.task('default', ['build']);