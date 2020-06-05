const gulp = require('gulp');
const concat = require('gulp-concat');
const expose = require('gulp-expose');
const del = require('del');
const copy = require('gulp-copy');

gulp.task('clean', async function() {
	return del([
		'dist/*'
	]);
});

gulp.task('copy', async function() {
	return gulp
		.src(['src/Page.html', 'src/CheckHoldings.html', 'src/CheckRetentions.html', 'src/GetHoldings.html', 'src/GetHoldingsCount.html','src/GetRetentions.html', 'src/appsscript.json'])
		.pipe(copy('dist', { prefix: 1 }))
});

gulp.task('build', async function(){
	return gulp.src('src/*.js')
		.pipe(concat('Code.gs'))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist', gulp.series('clean', gulp.parallel('copy', 'build'), async function() {
	console.log('success')
}));

