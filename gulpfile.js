const {src, dest, series, watch, lastRun} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const terser = require('gulp-terser');

// compile scss
function scssTask() {
    return src('src/scss/*.scss', 
        [{sourcemaps: true}, 
         {since: lastRun(scssTask)}])
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix('last 2 versions'))
      .pipe(cleanCss())
      .pipe(dest('dist/css', {sourcemaps: '.'}))
      .pipe(browserSync.stream());
}

function watchTasks() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch('index.html').on('change', browserSync.reload);
    watch('./src/scss/**/*.scss', scssTask);
}

exports.default = series(
    scssTask,
    watchTasks
);

exports.w = watchTasks;