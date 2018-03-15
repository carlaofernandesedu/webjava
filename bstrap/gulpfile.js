var gulp = require("gulp");
gulp.task("copy",
function()
{
    gulp.src("./bower_components/bootstrap/dist/**").pipe(gulp.dest("./wwwroot/lib/bootstrap"));
});