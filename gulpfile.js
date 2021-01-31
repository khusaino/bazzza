let gulp = require('gulp');
let less = require('gulp-less');
var path = require('path');
let browserSync = require('browser-sync');
let uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({ browsers: ['last 5 versions'] }),
    del = require('del');

gulp.task('clean', async function(){
    del.sync('dist')
});
 
gulp.task('less', function () {
  return gulp.src('app/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
    return gulp.src([
        'node_modules/swiper/swiper.less',
        'node_modules/normalize.css/normalize.css',
        
    ])
    .pipe(concat('_libs.less'))
    .pipe(gulp.dest('app/less'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function(){
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
    return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function(){
    return gulp.src([
        'node_modules/swiper/swiper-bundle.js',
        
    ])
    .pipe(concat('lips.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
//    .pipe(browserSync.reload({stream:true}))
});

gulp.task('export',  function(){
    let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
    let buildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'))
    let buildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    let buildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))
    let buildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'))
});

gulp.task('watch',function(){
    gulp.watch('app/less/**/*.less', gulp.parallel('less'))
    gulp.watch('app/*html',gulp.parallel('html'))
    gulp.watch('app/js/*js',gulp.parallel('script'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('build', gulp.series('clean','export'));

gulp.task('default', gulp.parallel('css','less','js','browser-sync','watch'));
