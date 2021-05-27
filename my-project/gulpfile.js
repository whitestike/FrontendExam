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

function imageOpt(){
    return gulp.src('./src/**/*.png')
        .pipe(webp())
        .pipe(gulp.dest('./build'))
}

function svgOpt(){
    return gulp.src('./src/**/*.svg')
        .pipe(webp())
        .pipe(gulp.dest('./build'))
}

function build(cb){cb();}

exports.build = gulp.series(clean, gulp.parallel(styles, scripts, svgOpt,imageOpt, sass));
exports.scripts = scripts;
exports.styles = styles;
exports.clean = clean;
exports.imageOpt = imageOpt;
exports.svgOpt = svgOpt;
exports.sass = sass;
exports.watch = watchAll;

exports.default = gulp.series(clean, gulp.parallel(styles, scripts, imageOpt, svgOpt, sass), watchAll);