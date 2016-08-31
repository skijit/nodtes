var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  path = require('path'),
  ts = require('gulp-typescript');

gulp.task('transpile', function() {
  var targetDir = './bin/target';
  var tsProject = ts.createProject("tsconfig.json");
  tsProject .src()
            .pipe(ts(tsProject))
            //.js.pipe(gulp.dest("."));
            .pipe(gulp.dest(targetDir));
  gulp.src('./package.json').pipe(gulp.dest(targetDir));
  gulp.src('./public/**/*').pipe(gulp.dest(targetDir+'/public'));
  gulp.src('./views/**/*').pipe(gulp.dest(targetDir+'/views'));
            
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'handlebars ts',
    ignore: ["node_modules/**/*", "bin/target/**/*"],
    tasks: function(changedFiles) {
      //only invoke transpile task when ts files have changed
      var bTranspile = false;
      for (var i = 0; i < changedFiles.length; i++) {
        if (path.extname(changedFiles[i]) === '.ts') {
          bTranspile = true;
          console.log('Gulp -> Need to Transpile TS files due to change in ' + changedFiles[i]);
          break;
        }
      }
      return bTranspile ? ['transpile'] : [];
    },
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', ['transpile', 'develop']);
