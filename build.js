var stealTools = require("steal-tools");

var buildPromise = stealTools.build({
  config: __dirname + "/package.json!npm"
}, {
  bundleAssets: true,
  cleanCSSOptions: {
    "advanced": false
  },
	minify: false
});
// // options added by `donejs add nw` - START
// var nwOptions = {
//   buildDir: "./build",
//   version: "latest",
//   platforms: ["osx64"],
//   glob: [
//     "package.json",
//     "production.html",
//     "node_modules/steal/steal.production.js"
//   ]
// };
//
// var stealNw = require("steal-nw");
//
// // Check if the cordova option is passed.
// var buildNW = process.argv.indexOf("nw") > 0;
//
// if(buildNW) {
//   buildPromise = buildPromise.then(function(buildResult){
//     stealNw(nwOptions, buildResult);
//   });
// }
// // options added by `donejs add nw` - END
