const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');
const sinon = require('sinon');
const mocks = require("./mocks/gas-mocks");

const lib = gas.require('./src', mocks);

bib_holding_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib_holdings.json')).toString();
bib_holding_response_noHoldings = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_holdings.json')).toString();

describe('when getHoldingsCount request is stubbed', () => {
    before(() => {
	    sinon.stub(lib, 'getService').returns({
    		hasAccess: () => true,
    		getAccessToken: () => 'tk_123456'
    	});
      });
	afterEach(() => {
    	mocks.UrlFetchApp.fetch.restore();
      });
	after(() => {
    	lib.getService.restore();
      });
	describe('Make a request for a record with holdings', () => {
		it('returns proper holdings', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => bib_holding_response,
	    	    getResponseCode: () => 200
	    	  });	    
			let totalHoldingCount = lib.getHoldingsCount(318877925, 'US');
			expect(totalHoldingCount).to.equal(463);
		});	
	});
	
	describe('Make a request for a record with no holdings', () => {
		it('returns proper holdings', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => bib_holding_response_noHoldings,
	    	    getResponseCode: () => 200
	    	  });
		    let totalHoldingCount = lib.getHoldingsCount(318877925, "US");
			expect(totalHoldingCount).to.equal(246);

		});
	});
});