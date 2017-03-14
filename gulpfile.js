// Include gulp @ puglins
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
    pug = require('gulp-pug');
    var composer = require("gulp-composer");
    // plugins = require('gulp-load-plugins')();

// Define base folders
var src = 'src/',
    dist = 'dist/';

// Lint Task
gulp.task('lint', function() {
  return gulp.src(src + 'assets/javascripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src(src + 'assets/stylesheets/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(dist + 'css'))
    .pipe(browserSync.stream())
});

// Concatenate & Minify JS
gulp.task('scripts', ['copy:vendors'], function() {
  return gulp.src([src + 'assets/javascripts/**/*.js', src + 'assets/javascripts/vendors/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.stream())
});

gulp.task('pug', function() {
  return gulp.src(src + 'views/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
});

// Copy vendors/libs
gulp.task('copy:vendors', function() {
  return gulp.src(src + 'assets/javascripts/vendors/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js/vendors'))
    .pipe(browserSync.stream())
});

// Copy images
gulp.task('copy:images', function() {
   gulp.src(src + 'assets/images/**/*.{png,jpg,jpeg,svg}')
   .pipe(gulp.dest(dist + 'img'));
});

// Copy videos
gulp.task('copy:videos', function() {
   gulp.src(src + 'assets/videos/**/*.{mp4}')
   .pipe(gulp.dest(dist + 'videos'));
});

// Copy fonts
gulp.task('copy:fonts', function() {
   gulp.src(src + 'assets/fonts/**/*.{ttf,woff,eof,svg,otf}')
   .pipe(gulp.dest(dist + 'fonts'));
});

// Watch Files For Changes
gulp.task('watch', ['browserSync', 'compile'], function() {
  gulp.watch(src + 'assets/javascripts/**/*.js', ['lint', 'scripts']);
  gulp.watch(src + 'assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch(src + 'assets/images/**/*.{png,jpg,jpeg,svg}', ['copy:images']);
  gulp.watch(src + 'assets/fonts/**/*.{ttf,woff,eof,svg}', ['copy:fonts']);
  gulp.watch(src + 'views/**/*.pug', ['pug']);
});

// Sync Browser on Change
gulp.task('browserSync', function() {
  browserSync({
    ui: {
      port: 2016
    },
    port: 2017,
    // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
    ghostMode: true,
    server: {
      baseDir: dist
    },
  })
})

gulp.task('installLumen', function(){
  composer("composer create-project --prefer-dist laravel/lumen blog");
})

// Default Task
gulp.task('compile', ['pug', 'lint', 'sass', 'scripts']);
gulp.task('copy', ['copy:images', 'copy:videos', 'copy:fonts']);
gulp.task('default', ['pug', 'lint', 'sass', 'scripts', 'copy', 'watch']);
