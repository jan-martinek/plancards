const src = './src/', dist = './docs/';

const gulp        = require('gulp');
const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const livereload  = require('gulp-livereload');
const sass        = require('gulp-sass');
const plumber     = require('gulp-plumber');

gulp.task('buildJs', function () {
    return browserify({entries: `${src}js/main.js`, debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .on('error', function (err) {
            console.log(err.toString());
            this.emit("end");
        })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dist}js`))
        .pipe(livereload());
});

gulp.task('buildStyles', function() {
   return gulp.src(`${src}scss/style.scss`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: ['./node_modules/foundation-sites/scss', './node_modules/font-awesome/scss'] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dist}css/`));
});

gulp.task('copyFonts', function() {
    return gulp.src(['./node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest(`${dist}fonts/`));
});

gulp.task('copyIndex', function() {
    return gulp.src([`${src}index.html`])
        .pipe(gulp.dest(dist));
});

gulp.task('watch', ['buildJs', 'buildStyles', 'copyIndex', 'copyFonts'], function () {
    livereload.listen();
    gulp.watch(`${src}js/**/*.js`, ['buildJs']);
    gulp.watch(`${src}scss/**/*.scss`, ['buildStyles']);
    gulp.watch(`${src}index.html`, ['copyIndex']);
});

gulp.task('default', ['watch']);
