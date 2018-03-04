const gulp = require('gulp');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');
const indent = require('gulp-indent');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');
const htmlreplace = require('gulp-html-replace');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const shell = require('gulp-shell');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const clean = require('gulp-clean');


/** HTML */
gulp.task('html', () => {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('html:watch', ['browser-sync'], () => {
    return gulp.watch([
        'src/**/*.html'
    ], ['html']).on('change', browserSync.reload);
});

gulp.task('html:prepare', (cb) => {
    pump([
        gulp.src('build/**/*.html'),
        htmlreplace({
            'css': 'css/style.min.css',
            'js': 'js/script.min.js',
            'css-inner': '../css/style.min.css',
            'js-inner': '../js/script.min.js'
        }),
        htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }),
        gulp.dest('public/')
    ], cb);
});


/** JS */
gulp.task('scripts', (cb) => {
    return gulp.src([
            'src/js/index.js',
            'src/js/**/*.js'
        ])
        .pipe(concat('build/js/script.js', {
            newLine: '\n\n\n\n'
        }))
        .pipe(indent({
            tabs: false,
            amount: 4
        }))
        .pipe(wrap('(function(){\n\n<%= contents %>\n\n})();'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('scripts:watch', () => {
    gulp.watch('src/js/**/*.js', ['scripts']);
});

gulp.task('scripts:prepare', (cb) => {
    pump([
        gulp.src('build/js/script.js'),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest('public/js')
    ], cb);
});


/** CSS */
gulp.task('styles', () => {
    return gulp.src('src/scss/style.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('styles:watch', ['browser-sync'], () => {
    return gulp.watch([
        'src/css/sass/**/*.scss'
    ], ['styles']).on('change', browserSync.reload);
});

gulp.task('styles:prepare', (cb) => {
    pump([
        gulp.src('build/css/style.css'),
        cleanCSS(),
        rename({
            suffix: '.min'
        }),
        gulp.dest('./public/css')
    ], cb);
});


/** Assets */
gulp.task('copy:img', () =>  {
    return gulp.src(['src/img/**/*'])
        .pipe(gulp.dest('build/img/'));
});

gulp.task('copy:files', () =>  {
    return gulp.src(['src/files/**/*'])
        .pipe(gulp.dest('build/files/'));
});


/** browser-sync */
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './build/'
        },
        open: false
    });
});


/** Tasks */
gulp.task('default', ['layout', 'assets', 'js', 'css']);

gulp.task('layout', ['html:watch', 'html']);
gulp.task('assets', ['copy:img', 'copy:files']);
gulp.task('js', ['scripts:watch', 'scripts']);
gulp.task('css', ['styles:watch', 'styles']);

// gulp.task('deploy', shell.task([
//     'gulp build',
//     'git subtree push --prefix public origin gh-pages'
// ]));

// gulp.task('clean', () =>  {
//     return gulp.src(['build/', 'public/'], { read: false })
//         .pipe(clean());
// });