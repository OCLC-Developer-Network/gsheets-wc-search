const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');
const sinon = require('sinon');
const mocks = require("./mocks/gas-mocks");

const lib = gas.require('./src', mocks);

bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib.json')).toString();
bib_noISBNs_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib-noISBNs.json')).toString();
no_bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_bib.json')).toString();

describe('when getMetadata request is stubbed', () => {
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
	describe('Make a request for a record', () => {
		it('Creates a proper object', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => bib_response,
	    	    getResponseCode: () => 200
	    	  });	    
			let bib = lib.getMetadata(318877925);
			expect(bib).to.be.an("object");
			expect(bib.oclcNumber).to.equal("318877925");
			expect(bib.title).to.equal("Simon's cat");
			expect(bib.author).to.equal("Tofield, Simon");
			expect(bib.isbns).to.be.an("array");
			expect(bib.isbns.join()).to.equal("9780446560061,0446560065");
			expect(bib.mergedOCNs).to.be.an("array");
			expect(bib.mergedOCNs.join()).to.equal("877908501,979175514,981548811,990719089,993246604,1005002644,1011917725,1016539262,1020206933,1043441377,1057597575,1089599685,1145205644");
		});	
	});
	
	describe('Make a request for a record with no ISBNs', () => {
		it('Creates a handles bib with no ISBNs object', () => {
		    sinon.stub(mocks.UrlFetchApp, 'fetch').returns({
	    	    getContentText: () => bib_noISBNs_response,
	    	    getResponseCode: () => 200
	    	  });		
			let bib = lib.getMetadata(1);
			expect(bib).to.be.an("object");
			expect(bib.oclcNumber).to.equal("1");
			expect(bib.title).to.equal("The Rand McNally book of favorite pastimes");
			expect(bib.author).to.equal("Grider, Dorothy");
			expect(bib.isbns).to.be.an("array");
			expect(bib.isbns.join()).to.equal("");
			expect(bib.mergedOCNs).to.be.an("array");
			expect(bib.mergedOCNs.join()).to.equal("6567842,9987701,53095235,433981287")
		});
	});
});