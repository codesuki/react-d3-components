/* globals __dirname require module */

var webpack = require("webpack"),
	path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "src/index.js"),

	output: {
		library: "ReactD3",
		libraryTarget: "umd",

		path: path.resolve(__dirname, "dist"),
		filename: "react-d3-components.js"
	},

	externals: {
		d3: true,
		react: "React"
	},

	module: {
		loaders: [
			// These enable JSX and ES6 support
			{
				test: /\.jsx?$/,
				exclude: /node_modules\//,
				loaders: ["babel"]
			}
		]
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.AggressiveMergingPlugin()
	]
};
