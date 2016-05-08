/*jshint node: true*/
var gulp = require('gulp');

var exec = require('child_process').exec;
var env = require('gulp-env');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');


var path = {
  src: {
    blocks: 'blocks/**',
    manifest: 'manifest.json',
    node_modules: 'node_modules/js-md5/build/*'
  },
  notTests: '!./**/*.test.js',
  dist: {
    all: 'dist/**',
    alljs: 'dist/blocks/**/*.js',
    blocks: 'dist/blocks',
    manifest: 'dist',
    node_modules: 'dist'
  },
  build: {
    itself: 'build',
    fx: 'build/firefox',
    chrome: 'build/chrome'
  },
  // environment file, where are stored API Credentials
  // from addons.mozilla.org
  // looks like:
  // {
  // "issuer": "************",
  // "secret": "************************************************************"
  // }

  env: '.env.json'
};

// Clean build directory
gulp.task('clean', function() {
  return gulp.src(path.build.itself, {
      read: false
    })
    .pipe(clean());
});

gulp.task('cp-blocks', function() {
  gulp.src(path.src.blocks)
    .pipe(gulp.dest(path.dist.blocks));
});
gulp.task('cp-manifest', function() {
  gulp.src(path.src.manifest)
    .pipe(gulp.dest(path.dist.manifest));
});
gulp.task('cp-node_modules', function() {
  gulp.src(path.src.node_modules)
    .pipe(gulp.dest(path.dist.node_modules));
});
// Copy task
gulp.task('cp', ['cp-blocks', 'cp-manifest', 'cp-node_modules']);

// Recopy all before watch
gulp.task('watch', ['cp'], function() {
  gulp.watch(path.src.blocks, ['cp-blocks']);
  gulp.watch(path.src.manifest, ['cp-manifest']);
  gulp.watch(path.src.node_modules, ['cp-node_modules']);

});

// Linter
gulp.task('lint', function() {
  return gulp.src(path.dist.alljs)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// getting issuer and secret from env file
env(path.env);

var execSign = 'web-ext sign' +
  ' -s dist' +
  ' -a ' + path.build.fx +
  ' --api-secret ' + process.env.secret +
  ' --api-key ' + process.env.issuer;

// -a build dir, -s source dir
var execPack = 'web-ext build' +
  ' -s dist' +
  ' -a ' + path.build.fx;

// Executing signing of Firefox WebExtension.
// It will send package to AMO and return
// signed extension to `build` folder
gulp.task('sign:fx', function(cb) {
  exec(execSign, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('pack:fx', ['lint'], function(cb) {
  exec(execPack, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });

});

// Packing for Chrome
gulp.task('pack:chrome', ['lint'], function() {
  var manifest = require('./' + path.dist.manifest + '/manifest.json'),
    distFileName = manifest.name + '-' + manifest.version + '.zip';
  // Build distributable extension
  return gulp.src(path.dist.all)
    .pipe(zip(distFileName))
    .pipe(gulp.dest(path.build.chrome));
});

// Copy all changes to dist and clean `build` before packing
gulp.task('build', ['cp', 'sign:fx', 'pack:chrome']);
