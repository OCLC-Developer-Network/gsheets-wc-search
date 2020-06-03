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
    library: 'Metadata'
  },  
  plugins: [
	    new CopyPlugin([
	        'Code.js',
	        'Page.html',
	        'CheckHoldings.html',
	        'GetHoldingsCount.html',
	        'GetRetentions.html',
	        'CheckRetentions.html',	        
	        'appsscript.json',
	        '.clasp.json'
	      ])
	  ]
	  
}