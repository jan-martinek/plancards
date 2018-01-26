const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const version = require('gulp-version-append');

const src = './src/';
const dist = './docs/';

gulp.task('buildJs', () => browserify({ entries: `${src}js/main.js`, debug: true })
  .transform('babelify', { presets: ['es2015'] })
  .bundle()
  .on('error', (err) => {
    console.log(err.toString());
    this.emit('end');
  })
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${dist}js`))
  .pipe(livereload()));

gulp.task('buildStyles', () => gulp.src(`${src}scss/style.scss`)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({ includePaths: ['./node_modules/foundation-sites/scss', './node_modules/font-awesome/scss'] }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${dist}css/`)));

gulp.task('copyFonts', () => gulp.src(['./node_modules/font-awesome/fonts/*'])
  .pipe(gulp.dest(`${dist}fonts/`)));

gulp.task('copyImages', () => gulp.src([`${src}img/*`])
  .pipe(gulp.dest(`${dist}img/`)));

gulp.task('copyCards', () => gulp.src([`${src}cards/*`])
  .pipe(gulp.dest(`${dist}cards/`)));

gulp.task('copyIndex', () => gulp.src([`${src}index.html`])
  .pipe(version(['js', 'css']))
  .pipe(gulp.dest(dist)));

gulp.task('watch', ['buildJs', 'buildStyles', 'copyIndex', 'copyFonts', 'copyImages', 'copyCards'], () => {
  livereload.listen();
  gulp.watch(`${src}js/**/*.js`, ['buildJs']);
  gulp.watch(`${src}scss/**/*.scss`, ['buildStyles']);
  gulp.watch(`${src}index.html`, ['copyIndex']);
});

gulp.task('default', ['watch']);
