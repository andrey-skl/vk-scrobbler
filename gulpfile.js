/*jshint node: true*/
var gulp = require('gulp');

var exec = require('child_process').exec;
var env = require('gulp-env');

var path = {
  src: {
    blocks: 'blocks/**',
    manifest: 'manifest.json',
    node_modules: 'node_modules/js-md5/build/*'
  },
  notTests: '!./**/*.test.js',
  dest: {
    itself: 'dist',
    blocks: 'dist/blocks',
    manifest: 'dist',
    node_modules: 'dist'
  },
  build: 'build',
  // environment file, where stored API Credentials
  // from addons.mozilla.org
  env: '.env.json'
};

gulp.task('cp-blocks', function() {
  gulp.src(path.src.blocks)
    .pipe(gulp.dest(path.dest.blocks));
});
gulp.task('cp-manifest', function() {
  gulp.src(path.src.manifest)
    .pipe(gulp.dest(path.dest.manifest));
});
gulp.task('cp-node_modules', function() {
  gulp.src(path.src.node_modules)
    .pipe(gulp.dest(path.dest.node_modules));
});

gulp.task('watch', function() {
  gulp.watch(path.src.blocks, ['cp-blocks']);
  gulp.watch(path.src.manifest, ['cp-manifest']);
  gulp.watch(path.src.node_modules, ['cp-node_modules']);

});

// getting issuer and secret from env file
env(path.env);

var execSign = 'web-ext -v sign' +
  ' -s ' + path.dest.itself +
  ' -a ' + path.build +
  ' --api-secret ' + process.env.secret +
  ' --api-key ' + process.env.issuer;

// -a build dir, -s source dir
var execPack = 'web-ext -v build' +
  ' -s ' + path.dest.itself +
  ' -a ' + path.build;

gulp.task('sign', function(cb) {
  exec(execSign, function(err, stdout, stderr) {
    // console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('pack', function(cb) {
  exec(execPack, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });

});

// Copy task
gulp.task('cp', ['cp-blocks', 'cp-manifest', 'cp-node_modules']);

// Recopy all to dist before watch
gulp.task('dist', ['cp', 'watch']);

// Copy all changes before packing
gulp.task('build', ['cp', 'pack']);
