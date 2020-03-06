const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry:{
      lib:'./src/lib.js'
  },
  output: 
  {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'appLibrary'
  },  
  plugins: [
	    new CopyPlugin([
	        'Code.js',
	        'Page.html',
	        'appsscript.json',
	        '.clasp.json'
	      ])
	  ]
	  
}