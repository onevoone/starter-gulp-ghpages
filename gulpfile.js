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


/** HTML */
gulp.task('html:build', (cb) => {
    pump([
        gulp.src('./src/index.html'),
        htmlreplace({
            'css': './css/style.min.css',
            'js': './js/script.min.js'
        }),
        htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }),
        gulp.dest('./public/')
    ], cb);
});


/** JS */
gulp.task('scripts', () => {
    return gulp.src([
            'src/js/scripts/**/*.js'
        ])
        .pipe(concat('src/js/script.js', {
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
        .pipe(gulp.dest('./'));
});

gulp.task('scripts:build', (cb) => {
    pump([
        gulp.src('./src/js/script.js'),
        uglify(),
        rename({suffix: '.min'}),
        gulp.dest('public/js')
    ], cb);
});

gulp.task('scripts:watch', () => {
    gulp.watch('src/js/scripts/**/*.js', ['scripts']);
});


/** CSS */
gulp.task('styles', () => {
    return gulp.src('src/css/sass/style.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('styles:build', (cb) => {
    pump([
        gulp.src('./src/css/style.css'),
        cleanCSS(),
        rename({
            suffix: '.min'
        }),
        gulp.dest('./public/css')
    ], cb);
});

gulp.task('styles:watch', ['browser-sync'], () => {
    gulp.watch([
        'src/index.html',
        'src/css/sass/**/*.scss'
    ], ['styles']);
    gulp.watch([
        'src/index.html',
        'src/css/sass/**/*.scss'
    ]).on('change', browserSync.reload);
});


/** browser-sync */
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './src/'
        },
        open: false
    });
});


/** Tasks */
gulp.task('default', ['js', 'css']);

gulp.task('js', ['scripts:watch', 'scripts']);
gulp.task('css', ['styles:watch', 'styles']);

gulp.task('build', [
    'html:build', 'scripts', 'scripts:build', 'styles', 'styles:build'
]);

gulp.task('deploy', shell.task([
    'gulp build',
    'git subtree push --prefix public origin gh-pages'
]));
