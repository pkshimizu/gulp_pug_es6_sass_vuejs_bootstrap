var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var browserSync = require("browser-sync");
var notify = require("gulp-notify");
var pug = require("gulp-pug");

gulp.task('default', ['js', 'sass', 'browser-sync', 'pug', 'watch']);

gulp.task('watch', () => {
    gulp.watch(['./src/main/js/**'], () => {
        gulp.start(['js']);
    });
    gulp.watch(['./src/main/sass/**'], () => {
        gulp.start(['sass']);
    });
    gulp.watch(['./src/main/pug/**'], () => {
        gulp.start(['pug']);
    });
});

gulp.task('browser-sync', () => {
    browserSync({
        server: {
            baseDir: "./dist"
        },
        startPath: "/index.html"
    });

    gulp.watch("./js/**/*.js",     ['reload']);
    gulp.watch("./*.html",         ['reload']);
});

gulp.task("sass", () => {
    gulp.src("./src/main/sass/**/*.sass")
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass())
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream())
});

gulp.task("pug", () => {
    var option = {
        pretty: true
    }
    gulp.src("./src/main/pug/**/*.pug")
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(pug(option))
    .pipe(gulp.dest("./dist/"))
});

gulp.task("js", () => {
    gulp.src("./src/main/js/**/*.js")
    .pipe(gulp.dest("./dist/js/"))
});

gulp.task('reload', () => {
    browserSync.reload();
});
