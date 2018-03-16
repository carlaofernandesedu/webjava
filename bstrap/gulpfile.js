var gulp = require("gulp");
gulp.task("copy",
function()
{
    gulp.src("./bower_components/bootstrap/dist/**").pipe(gulp.dest("./wwwroot/lib/bootstrap"));
    gulp.src("./bower_components/jquery/dist/**").pipe(gulp.dest("./wwwroot/lib/jquery"));
});