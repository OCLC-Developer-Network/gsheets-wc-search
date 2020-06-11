const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');

const lib = gas.require('./src');

bib_retentions_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib_retained_holdings.json')).toString();
bib_retentions_response_noHoldings = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_retained_holdings.json')).toString();

describe('parse retentions tests', () => {
	it('Creates a proper retention data object', () => {
		let retentionData = lib.parseRetentionsData(bib_retentions_response);
		expect(retentionData).to.be.an("object");
		expect(retentionData.numberOfRetentions).to.equal(1);
		expect(retentionData.oclcSymbolRetentions).to.be.an("array");		
		expect(retentionData.oclcSymbolRetentions.join()).to.equal("VKM");

	});
	
	it('parse handles no retentions', () => {
		let retentionData = lib.parseRetentionsData(bib_retentions_response_noHoldings);
		expect(retentionData).to.be.an("object");
		expect(retentionData.numberOfRetentions).to.equal(0);
		expect(retentionData.oclcSymbolRetentions).to.be.an("array");
		expect(retentionData.oclcSymbolRetentions.join()).to.equal("");
	});
});
