const ClosureCompilerPlugin = require('webpack-closure-compiler');
const merge = require('webpack-merge');
const base = require ('./webpack.base.config.js')

module.exports = merge (base, {
	plugins: [
        new ClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT5'
          },
          concurrency: 3,
		})
    ]
});
