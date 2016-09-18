/*jshint node: true*/
var gulp = require('gulp');
var runSequence = require('run-sequence');
var exec = require('child_process').exec;
var zip = require('gulp-zip');
var del = require('del');
var jshint = require('gulp-jshint');
var bump = require('gulp-bump');

var path = {
  src: {
    blocks: 'blocks/**',
    javascriptSources: 'blocks/**/*.js',
    cssSources: 'blocks/**/*.css',
    manifest: 'manifest.json',
    package: 'package.json',
    node_modules: 'node_modules/js-md5/build/*'
  },
  not: {
    tests:  '!./**/*.test.js',
    css: '!./**/*.css',
  },
  dist: {
    all: 'dist/**',
    blocks: 'dist/blocks',
    manifest: 'dist',
    node_modules: 'dist/components'
  },
  build: {
    itself: 'build',
    firefox: 'build/firefox',
    chrome: 'build/chrome'
  },
  // environment file with API Credentials
  // from addons.mozilla.org
  // looks like:
  // {
  // "issuer": "************",
  // "secret": "************************************************************"
  // }

  env: '.env.json'
};
// Because You can't reload to AMO an addon with the same
// version twice, there is need to bump version everytime.
gulp.task('bump', function(){
  gulp.src([path.src.package, path.src.manifest])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('clean', function() {
  return del([path.build.itself, path.dist.all]);
});

gulp.task('styles', function() {
    gulp.src(path.src.cssSources)
        .pipe(gulp.dest(path.dist.blocks));
});

gulp.task('copy-blocks', function() {
  return gulp.src([path.src.blocks, path.not.tests, path.not.css])
    .pipe(gulp.dest(path.dist.blocks));
});
gulp.task('copy-manifest', function() {
  return gulp.src(path.src.manifest)
    .pipe(gulp.dest(path.dist.manifest));
});
gulp.task('copy-node_modules', function() {
  return gulp.src(path.src.node_modules)
    .pipe(gulp.dest(path.dist.node_modules));
});

gulp.task('copy', function(finishCallback) {
  runSequence('clean', ['copy-blocks', 'copy-manifest', 'copy-node_modules', 'styles'], finishCallback);
});

// Recopy all before watch
gulp.task('watch', ['copy'], function() {
  gulp.watch(path.src.cssSources, ['styles']);
  gulp.watch(path.src.blocks, ['copy-blocks']);
  gulp.watch(path.src.manifest, ['copy-manifest']);
  gulp.watch(path.src.node_modules, ['copy-node_modules']);
});

// Linter
gulp.task('lint', function() {
  return gulp.src(path.src.javascriptSources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// Executing signing of Firefox WebExtension.
// It will send package to AMO and return
// signed extension to `build` folder
gulp.task('sign:firefox', function(cb) {
  // getting issuer and secret from env file
  var signParams = require('./' + path.env);

  var execSign = 'web-ext sign' +
    ' -s dist' +
    ' -a ' + path.build.firefox +
    ' --api-secret ' + signParams.secret +
    ' --api-key ' + signParams.issuer;

  exec(execSign, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('pack:firefox', function(cb) {
  // -a build dir, -s source dir
  var execPack = 'web-ext build' +
    ' -s dist' +
    ' -a ' + path.build.firefox;

  exec(execPack, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });

});

// Packing for Chrome
gulp.task('pack:chrome', function() {
  var manifest = require('./' + path.dist.manifest + '/manifest.json'),
    distFileName = manifest.name + '-' + manifest.version + '.zip';
  // Build distributable extension
  return gulp.src(path.dist.all)
    .pipe(zip(distFileName))
    .pipe(gulp.dest(path.build.chrome));
});

gulp.task('build', function() {
  runSequence('bump' ,'copy', 'pack:chrome', 'sign:firefox');
});

gulp.task('build:firefox', function() {
  runSequence('bump', 'copy', 'sign:firefox', 'pack:firefox');
});

gulp.task('build:chrome', function() {
  runSequence('copy', 'pack:chrome');
});
