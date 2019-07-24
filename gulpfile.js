var gulp = require('gulp');
var pug = require('gulp-pug');
var builder = require('electron-builder')

gulp.task('pug', function() {
	return gulp.src([
		'./src/pug/*.pug'
	])
	.pipe(pug())
	.pipe(gulp.dest('./src/html'));
});

gulp.task('watch', function() {
	gulp.watch ([
			'src/pug/*.pug',
		], gulp.series('pug')
	);
});

gulp.task('build', gulp.series('pug'));
gulp.task('pack:win', function() {
	gulp.series('build');
	builder.build({
		config: {
			appId: '${packagejson.name}',
			directories: {
				output: 'dist'
			},
		}
	});
})
gulp.task('pack:win', function() {
	gulp.series('build');
	builder.build({
		platform: 'win',
		config: {
			appId: '${packagejson.name}',
			directories: {
				output: 'dist'
			},
			win: {
				target: {
					target: 'zip',
					arch: 'x64'
				}
			}
		}
	});
})