const fs = require('fs');

exports.bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib.json')).toString();