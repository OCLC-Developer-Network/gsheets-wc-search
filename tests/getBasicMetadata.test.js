const expect = require('chai').expect;
const fs = require('fs');

const lib = require('../src/lib.js');

describe('parse basic metadata tests', () => {
	it('Creates a proper object', () => {
		let bib = lib.getBasicMetadata(bib_response);
		expect(bib).to.be.an("object");
		expect(bib.oclcNumber).to.equal(128807);
		expect(bib.title).to.equal(128807);
		expect(bib.author).to.equal(128807);
		expect(bib.isbns).to.equal(128807);
		expect(bib.mergedOCNs).to.equal(128807);
	});
});
