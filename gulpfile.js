var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var browserSync = require("browser-sync");
var notify = require("gulp-notify");
var pug = require("gulp-pug");
var babelify = require("babelify")
var browserify = require("browserify")
var buffer = require("vinyl-buffer")
var source = require("vinyl-source-stream")
var sourcemaps = require("gulp-sourcemaps")
var uglify = require("gulp-uglify")
var postcss = require("gulp-postcss")
var postcssImport = require("postcss-import")
var vueify = require('vueify')

gulp.task('default', ['es6', 'sass', 'browser-sync', 'pug', 'watch']);

gulp.task('watch', () => {
  gulp.watch(['./src/main/js/**'], () => {
    gulp.start(['es6']);
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

  gulp.watch("./js/**/*.js", ['reload']);
  gulp.watch("./*.html", ['reload']);
});

gulp.task("sass", () => {
  gulp.src("./src/main/sass/**/*.sass")
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(sass())
  .pipe(postcss([postcssImport]))
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

gulp.task("es6", () => {
  browserify({
    entries: "./src/main/js/app.js",
    debug: true,
    extensions: ['.js', '.vue'],
    transform: [
      vueify,
      babelify.configure({ 'presets' : ['es2015'] })
    ]
  })
  .bundle()
  .on("error", err => console.log("Error: " + err.message))
  .pipe(source("app.js"))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(uglify())
  .pipe(sourcemaps.write("./"))
  .pipe(gulp.dest("./dist/js/"))
});

gulp.task('reload', () => {
  browserSync.reload();
});
