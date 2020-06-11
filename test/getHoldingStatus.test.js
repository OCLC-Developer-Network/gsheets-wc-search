const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');
const sinon = require('sinon');
const mocks = require("./mocks/gas-mocks");

const lib = gas.require('./src', mocks);

holdings_status_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/holding_status.json')).toString();
no_holdings_status_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/noholdings_status.json')).toString();

describe('when getHoldingStatus request stubbed', () => {
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
		it('returns proper holdings status', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => holdings_status_response,
	    	    getResponseCode: () => 200
	    	  });	    
		    let holdingStatus = lib.getHoldingStatus("27972555", "heldBy", "OCPSB");
			expect(holdingStatus).to.equal('TRUE');
		});	
	});
	
	describe('Make a request for a record with no holdings', () => {
		it('returns proper holdings status', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => no_holdings_status_response,
	    	    getResponseCode: () => 200
	    	  });		
			let holdingStatus = lib.getHoldingStatus("1", "heldBy", "OCPSB");
			expect(holdingStatus).to.equal('FALSE');
		});
	});
});