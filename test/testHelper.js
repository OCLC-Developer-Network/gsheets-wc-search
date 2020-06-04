const fs = require('fs');

exports.bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib.json')).toString();
exports.bib_noISBNs_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib-noISBNs.json')).toString();
exports.no_bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_bib.json')).toString();

exports.holding_status_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/holding_status.json')).toString();
exports.no_holding_status_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/noholdings_status.json')).toString();

exports.bib_holding_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib_holdings.json')).toString();
exports.bib_holding_response_noHoldings = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_holdings.json')).toString();

exports.bib_retentions_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib_retained_holdings.json')).toString();
exports.bib_retentions_response_noHoldings = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_retained_holdings.json')).toString();