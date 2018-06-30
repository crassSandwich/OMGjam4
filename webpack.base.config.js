// useful for webpack-serve

module.exports = {
	mode: process.env.NODE_ENV || 'development',
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'main.js'
	}
};
