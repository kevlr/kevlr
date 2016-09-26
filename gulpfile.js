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
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
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
    sourcemaps = require('gulp-sourcemaps'),
    svgSprite = require('gulp-svg-sprite');

var bounce = function () {
  gutil.beep();
  this.emit('end');
};

// Styles
gulp.task('styles', function() {
  return gulp.src(path + 'src/scss/main.scss')
  .pipe(plumber({ errorHandler: bounce }))
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: browers,
		cascade: false
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

// JS Library files
gulp.task('library', function() {
  return gulp.src(path + 'src/js/lib/**/*.js')
  .pipe(gulp.dest(path + 'dist/js/lib'));
});

// Scripts
gulp.task('scripts', ['jshint'], function() {
  return gulp.src([
    path + 'src/js/plugins/**/*.js',
    path + 'src/js/modules/**/*.js'
  ])
  .pipe(plumber({ errorHandler: bounce }))
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'))
  .pipe(gulp.dest(path + 'dist/js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path + 'dist/js'))
  .pipe(notify({ message: 'Scripts task complete' }));
});

// Icons sprite
// gulp.task('icons', function() {
//   return gulp.src([path + 'src/img/icons/**/*.svg'])
//   .pipe(svgSprite(config)),
//   .pipe(gulp.dest(path + 'dist/img'));
// });

// Optimize images
gulp.task('images', function() {
  return gulp.src(path + 'src/img/**/*')
  .pipe(cache(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo({plugins: [{cleanupIDs: false}]})
  ])))
  .pipe(gulp.dest(path + 'dist/img'))
  .pipe(notify({ message: 'Images task complete' }));
});

// Copy font files
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest(path + 'dist/fonts'));
})

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'scripts', 'library', 'images', 'fonts');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch(path + 'src/scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch(path + 'src/js/**/*.js', ['scripts']);

  // Watch .js files in lib folder
  gulp.watch(path + 'src/js/lib/**/*.js', ['library']);

  // Watch image files
  gulp.watch(path + 'src/img/**/*', ['images']);

  // Watch font files
  gulp.watch(path + 'src/fonts/**/*', ['fonts']);

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
