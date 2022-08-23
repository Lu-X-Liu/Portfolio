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
    ['small', 500]
]);

const landscape =new Map([
    ['small', 375],
    ['medium', 750]
])

allImgs['portrait'] = portrait;
allImgs['landscape'] = landscape;

const srcDesign = 'src/img/design/';
const distDesign = 'dist/img/design/';  

const srcIllustration = 'src/img/illustration/';
const distIllustration = 'dist/img/illustration/';

function test(cb) {
    console.log(allImgs);
    cb();
}

function renameDesignImgs() {
    return src(srcDesign + '*.{jpg,png}')
    .pipe(rename(function (path) {
        path.basename += '_large'; 
    }))
    .pipe(dest(distDesign + 'large/'));
}

function renameIllustrationImgs() {
    return src(srcIllustration + '**/*.{jpg,png}')
    .pipe(rename(function (path) {
        path.basename += '_large'; 
    }))
    .pipe(dest(distIllustration + 'large/'));
}

function renameImgs() {
    return src(distIllustration + 'xlarge/*.{jpg,png}')
        .pipe(rename(function (path) {
            path.basename = path.basename.replace('_xlarge', '_large');
        }))
        .pipe(dest(distIllustration + 'large/'));
}

function resizeDesignImgs(cb) {
    for (const item in allImgs) {
        if (item === 'portrait'){
            allImgs[item].forEach((size, key) => {
                src(srcDesign + '*.{jpg,png}', {since: lastRun(optimizeDesignImgs)})
                .pipe(        
                    imgResize({
                    width: size,
                    noProfile: true,
                    flatten: true
                }))
                .pipe(rename(function (path) {
                    path.basename += '_' + key;
                }))
                .pipe(dest(distDesign + key + '/' ))
                .pipe(browserSync.stream());
            }) 
        }
    }               
    cb();
}

function resizeIllustrationImgs(cb) {
    for (const item in allImgs) {
        if (item === 'portrait'){
            allImgs[item].forEach((size, key) => {
                src(srcIllustration + '*.{jpg,png}')
                .pipe(        
                    imgResize({
                    width: size,
                    noProfile: true,
                    flatten: true
                }))
                .pipe(rename(function (path) {
                    path.basename += '_' + key;
                }))
                .pipe(dest(distIllustration + key + '/' ))
                .pipe(browserSync.stream());
            }) 
        } else 
        if (item === 'landscape') {
            allImgs[item].forEach((size, key) => {
                src(srcIllustration + 'landscape/*.{jpg,png}')
                .pipe(        
                    imgResize({
                    width: size,
                    noProfile: true,
                    flatten: true
                }))
                .pipe(rename(function (path) {
                    path.basename += '_' + key;
                }))
                .pipe(dest(distIllustration + key + '/' ))
                .pipe(browserSync.stream());
            })           
        }
    }               
    cb();
}

//optimize all images
const imgSizes = ['small', 'medium', 'large'];

function optimizeDesignImgs(cb) {
    imgSizes.forEach((size) => {
        src(distDesign+ size + '/*.{jpg,png}', {since: lastRun(optimizeDesignImgs)})
        .pipe(imagemin([
        imagemin.mozjpeg({quality:75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        ]))
        .pipe(dest(distDesign + size + '/'))
        .pipe(browserSync.stream());       
    })
    cb();
}

function optimizeIllustrationImgs(cb) {
    imgSizes.forEach((size) => {
        src(distIllustration+ size + '/*.{jpg,png}', {since: lastRun(optimizeIllustrationImgs)})
        .pipe(imagemin([
        imagemin.mozjpeg({quality:75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        ]))
        .pipe(dest(distIllustration + size + '/'))
        .pipe(browserSync.stream());       
    })
    cb();
}
//potimize single img 
function optimizeSingleImg(cb) {  
    src(distIllustration+ 'large' + '/scrach-board-putin_large.png', {since: lastRun(optimizeSingleImg)})
    .pipe(imagemin([
    imagemin.mozjpeg({quality:60, progressive: true}),
    imagemin.optipng({optimizationLevel: 7}),
    ]))
    .pipe(        
        imgResize({
        width: 500,
        noProfile: true,
        flatten: true
    }))
    .pipe(rename(function (path) {
        path.basename = path.basename.replace('_large', '_small');
    }))
    .pipe(dest(distIllustration + 'small' + '/'));      
    cb();
}

//create webp for display images

function webpDesignImgs(cb) {
    imgSizes.forEach((size) => {
    src(distDesign + size + '/*.{jpg,png}')
    .pipe(webp())
    .pipe(dest(distDesign + 'webp/' + size + '/'))
    .pipe(browserSync.stream());          
    }) 
    cb();      
}

function webpIllustrationImgs(cb) {
    imgSizes.forEach((size) => {
    src(distIllustration + size + '/*.{jpg,png}')
    .pipe(webp())
    .pipe(dest(distIllustration + 'webp/' + size + '/'))
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

exports.watch = watchTasks;

exports.re = renameDesignImgs;

exports.r = resizeDesignImgs;

exports.o = optimizeDesignImgs;

exports.w = webpDesignImgs;

exports.t = test;

//illustration function exports

exports.reI = renameIllustrationImgs;

exports.rI = resizeIllustrationImgs;

exports.oI = optimizeIllustrationImgs;

exports.oW = webpIllustrationImgs;

exports.RI = renameImgs;

exports.s = optimizeSingleImg;