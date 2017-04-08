/**
 *  Web Starter Kit
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import rimraf   from 'rimraf';

const $ = gulpLoadPlugins();
// const reload = browserSync.reload;
// 输出目录
const dist = 'dist';
const PRODUCTION = false;

gulp.task('css',
    gulp.series(css, libcss));

gulp.task('js',
    gulp.series(javascript, libjs));

// build任务：先调用clean，在并行调用javascript、images
gulp.task('build',
    gulp.series(clean, gulp.parallel('css', images, 'js', copyhtml)));

gulp.task('default',
    gulp.series('build'));

gulp.task('dev',
    gulp.series('build', server, watch));

// Reload the browser with BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch("js/**/*.js").on('change', gulp.series(javascript, reload));
  gulp.watch("css/**/*.css").on('change', gulp.series(css, reload));
  gulp.watch("index.html").on('change', gulp.series(copyhtml, reload));
}

// 清空dest目录
function clean(done) {
  rimraf(dist, done);
}

var lib = {
	js: [
		'node_modules/todomvc-common/base.js',
		'node_modules/jquery/dist/jquery.js',
		'node_modules/handlebars/dist/handlebars.js',
		'node_modules/director/build/director.js'
	],
	css:[
		'node_modules/todomvc-app-css/index.css',
		'node_modules/todomvc-common/base.css'
	]
}

// 合并css
function css() {
  return gulp.src("css/**/*.css")
		.pipe($.concat('app.css'))
		.pipe(gulp.dest(dist));
}

function libcss() {
  return gulp.src(lib.css)
		.pipe($.concat('lib.css'))
		.pipe(gulp.dest(dist));
}

// 合并压缩js
// 若PRODUCTION为true就混淆js
function javascript() {
	return gulp.src("js/**/*.js")
		.pipe($.sourcemaps.init())
		.pipe($.concat('app.js'))
		.pipe($.if(PRODUCTION, $.uglify().on('error', e => { console.log(e); })))
		.pipe(gulp.dest(dist));;
}

// 合并压缩js
// 若PRODUCTION为true就混淆js

function libjs() {
	return gulp.src(lib.js)
		.pipe($.sourcemaps.init())
		.pipe($.concat('lib.js'))
		.pipe($.if(PRODUCTION, $.uglify().on('error', e => { console.log(e); })))
		.pipe(gulp.dest(dist));;
}

// copy 图片到输出目录，若PRODUCTION则压缩图片
function images() {
  return gulp.src("src/images/**/*")
      // .pipe($.if(PRODUCTION, $.imagemin({
      //   progressive: true
      // })))
      .pipe(gulp.dest(dist + "/images"));
}


function copyhtml() {
  return gulp.src("index.html")
      // .pipe($.if(PRODUCTION, $.imagemin({
      //   progressive: true
      // })))
      .pipe(gulp.dest(dist));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browserSync.init({
    server: {
      baseDir: dist,
      index: 'index.html'
    }, 
    port: 8888
  });
  done();
}