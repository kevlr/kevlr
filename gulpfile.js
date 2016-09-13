// path to assets directory
var path = '';

// Browser definitions for autoprefixer
var browers = [
  'last 3 versions',
  'ie >= 9',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber');
    sourcemaps = require('gulp-sourcemaps');

var bounce = function (err) {
  gutil.beep();
  this.emit('end');
};

// Styles
gulp.task('styles', function() {
  return sass(path + 'src/scss/main.scss', {
    style: 'expanded',
    emitCompileError: true
  })
  .on('error', bounce)
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({
    browsers: browers
  }))
  .pipe(gulp.dest(path + 'dist/css'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(cssnano())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path + 'dist/css'))
  .pipe(notify({ message: 'Styles task complete' }));
});

// JS hint
gulp.task('jshint', function() {
  return gulp.src([path + 'src/js/modules/**/*.js'])
  .pipe(plumber({ errorHandler: bounce }))
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'))
  .pipe(notify({ message: 'Hint task done' }));
});

// Scripts
gulp.task('scripts', ['jshint'], function() {
  return gulp.src([
    path + 'src/js/plugins/**/*.js',
    path + 'src/js/modules/**/*.js'
  ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest(path + 'dist/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest(path + 'dist/js'))
  .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src(path + 'src/img/**/*')
  .pipe(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true,
    svgoPlugins: [
      {cleanupIDs: false}
    ]
  })))
  .pipe(gulp.dest(path + 'dist/img'))
  .pipe(notify({ message: 'Images task complete' }));
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(path + 'src/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch(path + 'src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch(path + 'src/img/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch([path + 'dist/**']).on('change', livereload.changed);
});

// Clear cache
gulp.task('cache', function (done) {
  return cache.clearAll(done);
});

// Clean
gulp.task('clean', function() {
  return del([path + 'dist/css', path + 'dist/js', path + 'dist/img']);
});
