const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: path.join(__dirname, 'main.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'main.js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'index.html'),
			filename: 'index.html',
		}),
	],
};
