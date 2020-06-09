const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');

const lib = gas.require('./src');

bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib.json')).toString();
bib_noISBNs_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib-noISBNs.json')).toString();
bib_no_subfieldb_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib-2.json')).toString();
bib_subfield_d_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/bib-3.json')).toString();
no_bib_response = fs.readFileSync(require('path').resolve(__dirname, './mocks/no_bib.json')).toString();

describe('parse basic metadata tests', () => {
	it('Creates a proper object', () => {
		let bib = lib.getBasicMetadata(bib_response);
		expect(bib).to.be.an("object");
		expect(bib.oclcNumber).to.equal("318877925");
		expect(bib.title).to.equal("Simon's cat");
		expect(bib.author).to.equal("Tofield, Simon");
		expect(bib.isbns).to.be.an("array");
		expect(bib.isbns.join()).to.equal("9780446560061,0446560065");
		expect(bib.mergedOCNs).to.be.an("array");
		expect(bib.mergedOCNs.join()).to.equal("877908501,979175514,981548811,990719089,993246604,1005002644,1011917725,1016539262,1020206933,1043441377,1057597575,1089599685,1145205644");
	});

	it('Creates a handles bib with no ISBNs object', () => {
		let bib = lib.getBasicMetadata(bib_noISBNs_response);
		expect(bib).to.be.an("object");
		expect(bib.oclcNumber).to.equal("1");
		expect(bib.title).to.equal("The Rand McNally book of favorite pastimes");
		expect(bib.author).to.equal("Grider, Dorothy");
		expect(bib.isbns).to.be.an("array");
		expect(bib.isbns.join()).to.equal("");
		expect(bib.mergedOCNs).to.be.an("array");
		expect(bib.mergedOCNs.join()).to.equal("6567842,9987701,53095235,433981287")
	});
	
	it('Creates a handles bib no 245 |b', () => {
		let bib = lib.getBasicMetadata(bib_no_subfieldb_response);
		expect(bib).to.be.an("object");
		expect(bib.oclcNumber).to.equal("1928");
		expect(bib.title).to.equal("Crossings");
		expect(bib.author).to.equal("Chuang, Hua");
		expect(bib.isbns).to.be.an("array");
		expect(bib.isbns.join()).to.equal("");
		expect(bib.mergedOCNs).to.be.an("array");
		expect(bib.mergedOCNs.join()).to.equal("8450570")
	});
	
	it('Creates a handles bib 1xx with |d', () => {
		let bib = lib.getBasicMetadata(bib_subfield_d_response);
		expect(bib).to.be.an("object");
		expect(bib.oclcNumber).to.equal("27972555");
		expect(bib.title).to.equal("Design, form, and chaos");
		expect(bib.author).to.equal("Rand, Paul");
		expect(bib.isbns).to.be.an("array");
		expect(bib.isbns.join()).to.equal("0300055536,9780300055535,9780300230918,0300230915");
		expect(bib.mergedOCNs).to.be.an("array");
		expect(bib.mergedOCNs.join()).to.equal("1008281567")
	});
	
	it('Creates a handles an error response object', () => {
		//let bib = lib.getBasicMetadata(no_bib_response);
		//expect(bib).to.be.an("object");
	});
	
});
