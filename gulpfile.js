var gulp = require('gulp');
var watch = require('gulp-watch');

var source = './*(_locales|blocks)/**/**!(test|foo).*';
var manifest = './manifest.json';
var components = './node_modules/js-md5/build/*';
var notTests = '!./**/*.test.js';

var gulpSources = [manifest, source, components, notTests];

var destination = './dist';

gulp.task('watch-copy', function() {
  return gulp.src(gulpSources, {base: './'})
    .pipe(watch(gulpSources))
    .pipe(gulp.dest(destination));
});

gulp.task('copy', function() {
  gulp
    .src(gulpSources, {base: './'})
    .pipe(gulp.dest(destination));
});
