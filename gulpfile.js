//const gulp = require('gulp');
const { src, dest, parallel, watch, series, task} = require('gulp')
const pug = require('gulp-pug');
const sass = require('gulp-sass')
const ts = require('gulp-typescript')
const lodash = require('lodash')
const fs = require('fs')
const del = require('del')
const {build, Platform, Arch} = require('electron-builder')
const packager = require('electron-packager')

var packageJson = require('./package.json')
var tsconfig = require('./tsconfig.json')

var html = () => {
	return src('src/pug/*.pug')
		.pipe(pug())
		.pipe(dest('dest/html'))
}
var css = () => {
	return src('src/scss/*.scss')
	.pipe(sass())
	.pipe(dest('dest/css'));
}

var typescript = () => {
	return src('src/ts/*.ts')
	.pipe(ts(tsconfig))
	.pipe(dest('dest/js'))
}

var assets = () => {
	return src("src/assets/*")
	.pipe(dest('dest/assets'));
}

// from https://qiita.com/Quramy/items/90d61ff37ca1b95a7f6d
var package_json = (done) => {
	var json = lodash.cloneDeep(packageJson)
	json.main = './js/main.js'
	fs.writeFile('dest/package.json', JSON.stringify(json), (err) => {
		done();
	});
}

task('watch', function() {
	return watch ([
			'src/pug/*.pug',
			'src/scss/*.scss',
			'src/ts/*.ts'
		], 
		parallel(pug, scss, typescript)
	);
});
var _build = parallel(html, css, typescript, assets, package_json);

exports.clean = (done) => {
	del(['dest', 'release'])
	.then(done())
}
exports.build = _build
exports.pack_linux = series(_build, () => {
	packager({
		dir: 'dest',
		name: packageJson.name,
		arch: 'x64',
		asar: true,
		platform: 'linux',
		out: 'release/linux',
		overwrite: true
	})
});
exports.pack_mac = series(_build, () => {
	packager({
		dir: 'dest',
		name: packageJson.name,
		arch: 'x64',
		asar: true,
		platform: 'darwin',
		icon : 'build/icon.icns',
		out: 'release/darwin',
		overwrite: true
	})
});
exports.pack_win = series(_build, (done) => {
	/*packager({
		dir: 'dest',
		name: packageJson.name,
		arch: 'x64',
		asar: true,
		platform: 'win32',
		icon : 'build/game-icon.ico',
		out: 'release/win32',
		overwrite: true
	})*/
	build({
		config: {
			appId : 'com.ephemeral.${packageJson.name}',
			productName : packageJson.name,
			directories : {
				app: 'dest',
				output: 'release/win32'
			},
			win: {
				target: 'zip',
				icon: 'build/game-icon.ico'
			}
		}
	}).finally(done())
});
