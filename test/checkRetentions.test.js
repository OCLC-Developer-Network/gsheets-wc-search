const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');
const sinon = require('sinon');
const mocks = require("./mocks/gas-mocks");

// need to mock OAuth service piece

const lib = gas.require('./src', mocks);

bib_retentions_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib_retained_holdings.json')).toString();
bib_retentions_response_noHoldings = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_retained_holdings.json')).toString();

describe('when checkRetentions request is stubbed', () => {
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
	describe('Make a request for a record with retentions', () => {
		it('returns proper retention status', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => bib_retentions_response,
	    	    getResponseCode: () => 200
	    	  });	    
			let retentionData = lib.checkRetentions(27972555, 'heldInState', 'NY');
			expect(retentionData).to.equal("TRUE");
		});	
	});
	
	describe('Make a request for a record with no retentions', () => {
		it('returns proper retention status', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => bib_retentions_response_noHoldings,
	    	    getResponseCode: () => 200
	    	  });
		    let retentionData = lib.checkRetentions(318877925, "heldInState", "CA");
			expect(retentionData).to.equal("FALSE");

		});
	});
});