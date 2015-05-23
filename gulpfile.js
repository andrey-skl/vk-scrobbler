var gulp = require('gulp');
var watch = require('gulp-watch');

var source = './*(_locales|blocks|img)/**/*';
var components = './node_modules/js-md5/build/*';
var destination = './dist';

gulp.task('watch-copy', function() {
  return gulp.src([source, components], {base: './'})
    .pipe(watch(source))
    .pipe(gulp.dest(destination));
});

gulp.task('copy', function() {
  gulp
    .src([source, components], {base: './'})
    .pipe(gulp.dest(destination));
});
