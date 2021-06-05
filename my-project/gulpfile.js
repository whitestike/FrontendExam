const gulp = require('gulp');
const cleanup = require('del');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');
const webp = require("gulp-webp");
const gulp_sass = require("gulp-sass");
const image = require("gulp-image");

function clean(){
    return cleanup([
        './build'
    ]);
}

function scripts(){
    return gulp.src('./src/**/*.js')
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./build/'));
}

function styles(){
    return gulp.src('./src/**/*.css')
        .pipe(postcss([
            autoprefixer(),
            cssnano(),
        ]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./build'));
}

function sass(){
    return gulp.src('./src/**/*.scss')
        .pipe(gulp_sass())
        .pipe(postcss([
            autoprefixer(),
            cssnano(),
        ]))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./build'));
}

function watchAll(){
    browserSync.init({
        server: "."
    });

    gulp.watch('./src/**/*.js', (cb) => {
        scripts();
        browserSync.reload();
        cb();
    })
    
    gulp.watch('./src/**/*.css', styles);

    gulp.watch('./src/**/*.scss', (cb) => {
        sass();
        browserSync.reload();
        cb();
    })

    gulp.watch("./*.html").on('change', browserSync.reload);
}

function pngOpt(){
    return gulp.src('./src/**/*.png')
        .pipe(webp())
        .pipe(gulp.dest('./build'))
}

function jpgOpt(){
    return gulp.src('./src/**/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('./build'))
}

function svgOpt(){
    return gulp.src('./src/**/*.svg')
        .pipe(image())
        .pipe(gulp.dest('./build'))
}

function build(cb){cb();}

exports.build = gulp.series(clean, gulp.parallel(styles, scripts, svgOpt, pngOpt, jpgOpt, sass));
exports.clean = clean;
exports.watch = watchAll;

exports.default = gulp.series(clean, gulp.parallel(styles, scripts, pngOpt, jpgOpt, svgOpt, sass), watchAll);