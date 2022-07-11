const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const sassLint = require('gulp-sass-lint');
const env = process.env.NODE_ENV;
const {SRC_PATH, DIST_PATH} = require('./gulp.config');

//  Копируем все содержимое из папки src в dist
const copy = () => {
  return gulp.src(`${SRC_PATH}/**/*.pug`)
    .pipe(gulp.dest(DIST_PATH));
};

const clean = () => {
  return del(DIST_PATH);
};

/**
 * Запускаем сервер
 */

const server = (done) => {
  browserSync.init({
    server: {
      baseDir: DIST_PATH
    }
  });
  done();
}; 

const reload = (done) => {
  browserSync.reload();
  done();
};

const styles = () => {
  return gulp.src(`${SRC_PATH}/styles/main.scss`)
    .pipe(gulpif(env === 'development',sourcemaps.init()))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(env === 'production', autoprefixer({cascade: false})
      )
    )
    .pipe(gulpif(env === 'production', gcmq()))
    .pipe(gulpif(env === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpif(env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(`${DIST_PATH}/styles`))
    .pipe(browserSync.stream()); // Перезагружаем локальный сервер
};

const stylesLint = () => {
  return gulp.src(`${SRC_PATH}/styles/**/*.scss`)
        .pipe(sassLint({
          configFile: '.sass-lint.yml'
          }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
};

const compilePug = () => {
  return gulp.src(`${SRC_PATH}/pug/pages/*.pug`)
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest(DIST_PATH))
};

const pugImage = () => {
  return gulp.src(`${SRC_PATH}/assets/*.*`)
    .pipe(gulp.dest(`${DIST_PATH}/images`))
};

const list = [`${SRC_PATH}/js/*.js`, `${SRC_PATH}/scripts/*.js`]

const scripts = () => {
  return gulp.src(list)
    .pipe(gulpif(env === 'development',sourcemaps.init()))
    .pipe(concat("main.js"))
    .pipe(gulpif(env === 'production',babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'production',uglify()))
    .pipe(gulpif(env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(`${DIST_PATH}/js`))
    .pipe(browserSync.stream())
}

const vendors = () => {
  return gulp.src(`${SRC_PATH}/js/vendors/**/*.js`)
    .pipe(gulpif(env === 'development',sourcemaps.init()))
    .pipe(concat("vendors.js"))
    .pipe(gulpif(env === 'production',babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'production',uglify()))
    .pipe(gulpif(env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(`${DIST_PATH}/js`))
    .pipe(browserSync.stream())
}

const fonts = () => {
  return gulp.src(`${SRC_PATH}/js/vendors/slick/fonts/*.*`)
    .pipe(gulp.dest(`${DIST_PATH}/styles/fonts`))
};

const gif = () => {
  return gulp.src(`${SRC_PATH}/js/vendors/slick/**/*.gif`)
    .pipe(gulp.dest(`${DIST_PATH}/styles`))
};

const watchers = (done) => {
  gulp.watch(`${SRC_PATH}/pug/**/*.pug`).on('all', gulp.series(compilePug, reload));
  gulp.watch(`${SRC_PATH}/**/*.scss`, gulp.parallel(styles, stylesLint));
  gulp.watch(`${SRC_PATH}/js/*.js`, gulp.series(scripts));
  gulp.watch(`${SRC_PATH}/assets/*.*`, gulp.series(pugImage, reload));
  done();
};

exports.build = gulp.series(clean, gulp.parallel(compilePug, pugImage, styles, stylesLint, scripts, vendors, fonts, gif));
exports.serve = gulp.series(clean, gulp.parallel(compilePug, pugImage, styles, stylesLint, scripts, vendors, fonts, gif), gulp.parallel(server, watchers));