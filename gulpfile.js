/*jshint node: true*/
var gulp = require('gulp');
var path = {
    src: {
        blocks:'blocks/**',
        manifest:'manifest.json',
        node_modules: 'node_modules/js-md5/build/*'
    },
    notTests: '!./**/*.test.js',
    dest: {
        blocks: 'dist/blocks',
        manifest: 'dist',
        node_modules: 'dist'
    }
};

gulp.task('cp-blocks', function(){
    gulp.src(path.src.blocks)
        .pipe(gulp.dest(path.dest.blocks));
});
gulp.task('cp-manifest', function(){
    gulp.src(path.src.manifest)
        .pipe(gulp.dest(path.dest.manifest));
});
gulp.task('cp-node_modules', function(){
    gulp.src(path.src.node_modules)
        .pipe(gulp.dest(path.dest.node_modules));
});

gulp.task('watch', function() {
    gulp.watch(path.src.blocks, ['cp-blocks']);
    gulp.watch(path.src.manifest, ['cp-manifest']);
    gulp.watch(path.src.node_modules, ['cp-node_modules']);

});
gulp.task('dist', ['cp-blocks', 'cp-manifest', 'cp-node_modules', 'watch']);
