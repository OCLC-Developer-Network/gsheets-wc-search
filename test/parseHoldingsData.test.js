const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');

const lib = gas.require('./src');

bib_holding_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib_holdings.json')).toString();
bib_holding_response_noHoldings = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_holdings.json')).toString();

describe('parse basic holdings tests', () => {
	it('Creates a proper holding data object', () => {
		let holdingData = lib.parseHoldingsData(bib_holding_response);
		expect(holdingData).to.be.an("object");
		expect(holdingData.totalHoldingCount).to.equal(463);
		expect(holdingData.libraries).to.be.an("array");
		expect(holdingData.libraries[0]).to.equal("KF6");

	});
	
	it('parse handles no holdings', () => {
		let holdingData = lib.parseHoldingsData(bib_holding_response_noHoldings);
		expect(holdingData).to.be.an("object");
		expect(holdingData.totalHoldingCount).to.equal(246);
		expect(holdingData.libraries).to.be.an("array");
		expect(holdingData.libraries.join()).to.equal("");
	});
});
