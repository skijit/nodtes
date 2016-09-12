var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  path = require('path'),
  del = require('del'),
  ts = require('gulp-typescript');
  
var targetDir = './bin/target';

gulp.task('transpile', function() {  
  var tsProject = ts.createProject("tsconfig.json");
  tsProject .src()
            .pipe(ts(tsProject))
            .pipe(gulp.dest(targetDir));
});

gulp.task('copyStaticFiles', function() {
  gulp.src('./public/**/*.{css,ico,js}').pipe(gulp.dest(targetDir+'/public'));  
});

gulp.task('copyPackageJson', function() {
  gulp.src('./package.json').pipe(gulp.dest(targetDir));
});

gulp.task('copyViews', function() {
  gulp.src('./views/**/*').pipe(gulp.dest(targetDir+'/views'));
})

gulp.task('clean', function () {
  return del(['./bin/target/**/*']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'handlebars ts css',
    ignore: ["node_modules/**/*", "bin/target/**/*"],
    tasks: function(changedFiles) {
      var execTasks = [ 'copyPackageJson' ];
      var bTranspile = false, bCopyStaticFiles = false, bCopyViews = false;
       
      //only invoke transpile task when ts files have changed
      for (var i = 0; i < changedFiles.length; i++) {
        if (path.extname(changedFiles[i]) === '.ts' && !bTranspile) {
          bTranspile = true;
          console.log('Gulp -> Need to Transpile TS files due to change in ' + changedFiles[i]);
          execTasks.push('transpile');
        } else if (path.extname(changedFiles[i]) === '.css' && !bCopyStaticFiles) {
          bCopyStaticFiles = true;
          console.log('Gulp -> Need to copy css files due to change in ' + changedFiles[i]);
          execTasks.push('copyStaticFiles');
        } else if (path.extname(changedFiles[i]) === '.handlebars' && !bCopyViews) {
          bCopyViews = true;
          console.log('Gulp -> Need to copy views due to change in ' + changedFiles[i]);
          execTasks.push('copyViews');
        }
      }
      return execTasks;
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

gulp.task('fullCopy', ['copyStaticFiles', 'copyPackageJson', 'copyViews', 'transpile'])

gulp.task('default', ['develop']);
