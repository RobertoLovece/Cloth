const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

 	mode: 'development',

  	entry: {
		index: './index.js',
		//print: './src/print.js',
 	},
 	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
 	},

 	plugins: [
		new HtmlWebpackPlugin({
		  	template: './index.html',
		  	inject: true,
		  	chunks: ['index'],
		  	filename: 'index.html'
		}),
 	],

	target: 'web',
  	devtool: 'inline-source-map',
  	devServer: {
		open: true,
		static: './dist',
		port: 8080,
  	},

  	module: {
		rules: [
	  		{
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
	  		},
	  	{
			test: /\.(png|svg|jpg|jpeg|gif)$/i,
			type: 'asset/resource',
	  	},
		],
 	},
};