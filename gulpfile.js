const { src, dest, series} = require('gulp')
const pug = require('gulp-pug');
const sass = require('gulp-sass')
const lodash = require('lodash')
const fs = require('fs')
const del = require('del')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const {build} = require('electron-builder')
const path = require('path')

var [main, renderer] = require('./webpack.config')
var packageJson = require('./package.json')

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
	return webpackStream([main, renderer], webpack)
	.pipe(dest(path.join('dest', 'js')))
}

var assets = () => {
	return src("src/assets/*")
	.pipe(dest('dest/assets'));
}

// from https://qiita.com/Quramy/items/90d61ff37ca1b95a7f6d
var package_json = (done) => {
	var json = lodash.cloneDeep(packageJson)
	json.main = './js/main.js'
	if (!fs.existsSync('dest')) {
		fs.mkdirSync('dest')
	}
	fs.writeFile('dest/package.json', JSON.stringify(json), (err) => {
		done(err);
	});
}

var _build = series(html, css, /*typescript,*/ assets, package_json);

exports.clean = (done) => {
	del(['dest', 'release'])
	.then(done())
}
exports.build = _build
exports.pack_win = series(_build, (done) => {
	build({
		x64: true,
		dir: false,
		config: {
			appId : 'com.github.ephemeral9794.' + packageJson.name,
			productName : packageJson.name,
			directories : {
				app: 'dest',
				output: 'release'
			},
			win: {
				icon: 'build/icon.ico'
			},
			nsis: {
				oneClick: false,
				installerIcon: 'build/icon.ico',
				license: 'LICENSE'
			}
		},
		win: [
			'nsis',
			'zip'
		]
	})
	.then(done())
	.catch((err) => done(err))
})
exports.pack_mac = series(_build, (done) => {
	build({
		x64: true,
		dir: false,
		config: {
			appId : 'com.github.ephemeral9794.' + packageJson.name,
			productName : packageJson.name,
			directories : {
				app: 'dest',
				output: 'release'
			},
			mac: {
				target: 'default',
				icon: 'build/icon.icns'
			}
		},
		mac: [
			'default',
			'dmg'
		]
	})
	.then(done())
	.catch((err) => done(err))
})
exports.pack_linux = series(_build, (done) => {
	build({
		x64: true,
		dir: false,
		config: {
			appId : 'com.github.ephemeral9794.' + packageJson.name,
			productName : packageJson.name,
			directories : {
				app: 'dest',
				output: 'release'
			},
			linux: {
				icon: 'build/icon.ico'
			}
		},
		linux: [
			'AppImage',
			'deb',
			'tar.xz'
		]
	})
	.then(done())
	.catch((err) => done(err))
})
