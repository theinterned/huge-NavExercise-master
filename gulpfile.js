var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

var source = "app/";
var dest = "build/";
var sassDir = source+"scss/**/";
var sassFiles = sassDir+"*.scss";
var jsDir = source+"js/**/";
var jsFiles = jsDir+"*.js";
var htmlFiles = source+"*.html";

gulp.task('sass', function(){
  console.log('Processing css');
  return gulp.src(sassFiles)
    .pipe(sass())
    .pipe(gulp.dest(source+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('nodemon', function(cb){
  var started = false;
  return nodemon({
    script: 'app.js'
  }).on('start', function(){
    if(!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('browserSync', ['nodemon'], function(){
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    browser: "google chrome",
    port: "3030",
    files: [dest+"**/*.*"],
    // server: {
    //   baseDir: 'app'
    // }
  });
});

gulp.task('watch', ['sass', 'browserSync'], function(){
  gulp.watch(sassFiles, ['sass']);
  gulp.watch(jsFiles, browserSync.reload);
  gulp.watch(htmlFiles, browserSync.reload);
});