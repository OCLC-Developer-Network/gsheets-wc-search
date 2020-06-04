const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');

const lib = gas.require('./src');

holdings_status_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/holding_status.json')).toString();
no_holdings_status_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/noholdings_status.json')).toString();

describe('parse holding search', () => {
	it('parses search that matches holdings', () => {
		let holdingStatus = lib.getHoldingStatus(holdings_status_response);
		expect(holdingStatus).to.equal('TRUE');
	});
	
	it('parses search with no results', () => {
		let holdingStatus = lib.getHoldingStatus(no_holdings_status_response);
		expect(holdingStatus).to.equal('FALSE');
	});
});
