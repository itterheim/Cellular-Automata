var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var sequence = require('run-sequence');

gulp.task('ts-ca', function () {
    return gulp.src('source/ts/**/*.ts').pipe(ts({
            declarationFiles: true,
            noResolve: false
        })).js.pipe(concat('ca.js')).pipe(gulp.dest('js/'));
});

gulp.task('min-ca', function () {
    return gulp.src('js/ca.js')
            .pipe(rename('ca.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('js/'));
});

gulp.task('build', function (callback) {
    sequence(['ts-ca'], ['min-ca'], callback);
});

gulp.task('stream', function () {
    gulp.watch('source/ts/**/*.ts', ['ts-ca']);
});
