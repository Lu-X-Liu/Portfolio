const {src, dest, series, watch, lastRun} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const imgResize = require('gulp-image-resize'); 
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

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

// minify js
function js() {
    return src('src/js/*.js', {sourcemaps: true})
      .pipe(terser())
      .pipe(rename({extname: '.min.js'}))
      .pipe(dest('dist/js', {sourcemaps: '.'}))
      .pipe(browserSync.stream());
}

//optimize images
const allImgs = {};

const portrait = new Map([
    ['small', 500],
    ['medium', 750],
    ['large', 1000]
]);

const landscape =new Map([
    ['small', 500],
    ['medium', 750],
    ['large', 1000],
    ['xlarge', 1300],
    ['xxlarge', 1500]   
])

allImgs['portrait'] = portrait;
allImgs['landscape'] = landscape;

const srcDesign = 'src/imgs/design/';
const distDesign = 'dist/imgs/design/';  

const srcIllustration = 'src/imgs/illustration/';
const distIllustration = 'dist/imgs/illustration/';

function resizeAllImgs(srcDirPath, distDirPath, cb) {
    for (const item in allImgs) {
        allImgs[item].forEach((size, key) => {
            src(srcDirPath + '*.jpg', {since: lastRun(resizeDisplayImgs)})
            .pipe(        
                imgResize({
                width: size
            }))
            .pipe(rename(function (path) {
                path.basename += '_' + key;
            }))
            .pipe(dest(distDirPath + key + '/' ))
            .pipe(browserSync.stream());
        }) 
    }               
    cb();
}

//optimize all images
const imgSizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];

function optimizeAllImgs( distDirPath, cb) {
    imgSizes.forEach((size) => {
        src(distDirPath + size + '/*.jpg', {since: lastRun(optimizeDisplayImgs)})
        .pipe(imagemin([
        imagemin.mozjpeg({quality:75, progressive: true}),
        imagemin.optipng({optimizationLevel: 3}),
        ]))
        .pipe(dest(distDirPath + size + '/'))
        .pipe(browserSync.stream());       
    })
    cb();
}

//watch tasks
function watchTasks() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch('index.html').on('change', browserSync.reload);
    watch('./src/scss/**/*.scss', scssTask);
    watch('./src/js/**/*.js', js);
}

exports.default = series(
    scssTask,
    js,
    watchTasks
    
);

exports.w = watchTasks;