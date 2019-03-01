const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cssUglify = require('gulp-minify-css');
const htmlMin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const {
    series,
    parallel,
    watch,
    dest,
    src
} = require('gulp');

//scss转css
function sassLoader() {
    return src('src/styles/**/*.scss')
        .pipe(sass())
        .pipe(dest('src/styles'));
};

//压缩图片
function minImg(cb) {
    return src('src/images/*')
        .pipe(imageMin())
        .pipe(dest('dist/images'))
};

//压缩js
function minJs(cb) {
    return src('src/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(dest('dist/js'))
};

//压缩样式
function minCss(cb) {
    return src('src/styles/**/*.css')
        .pipe(cssUglify())
        .pipe(dest('dist/styles'))
}

//copyHtml&minHtml
function copyHtml() {
    return src('src/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'))
}

//copy assect
function copyAssect() {
    return src('src/assect/**/*')
        .pipe(dest('dist/assect'))
}

//产品代码演示服务器；
function proServer() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
}

//开发模式
function dev(cb) {
    browserSync.init({
        server: {
            baseDir: "./src",
        }
    });
    watch("./src/styles/**/*.scss", series(sassLoader)).on('change', browserSync.reload);
    watch("./src/**/**.html").on('change', browserSync.reload);
    watch("./src/js/**/*.js").on('change', browserSync.reload);
};

const build = series(parallel(minImg, minJs, minCss, copyHtml, copyAssect));
const product = series(build, proServer);

module.exports = {
    dev, //开发模式
    build, //打包代码到dist
    product, //产品代码dist服务器
}