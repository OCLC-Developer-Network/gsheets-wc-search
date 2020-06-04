const expect = require('chai').expect;
const fs = require('fs');

var gas = require('gas-local');

const lib = gas.require('./src');

describe('create bib resource URL tests', () => {
	it('Creates a bib read url', () => {
		let url = lib.createRequestURL('getMetadata', "1");
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs/1");
	});
	
});

describe('create bib search URL tests', () => {	
	it('Creates url filter by OCLC Number + heldBy ', () => {
		let url = lib.createRequestURL('getHoldingStatus', "27972555", "heldBy", "OCPSB");
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs?q=no:27972555&heldBy=OCPSB");
	});
	
});

describe('create bib-holdings URL tests', () => {
	it('Creates url filter by country - getHoldingsCount', () => {
		let url = lib.createRequestURL('getHoldingsCount', '1696940', 'heldInCountry', 'US');
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs-holdings?oclcNumber=1696940&heldInCountry=US");
	});
	
	it('Creates url filter by country - getHoldings', () => {
		let url = lib.createRequestURL('getHoldings', '1696940', 'heldInCountry', 'US');
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs-holdings?oclcNumber=1696940&heldInCountry=US");
	});

});

describe('create bib-retained-holdings URL tests', () => {
	it('Creates url filter by state - checkRetentions', () => {
		let url = lib.createRequestURL('checkRetentions', '1696940', 'heldInState', 'IL')
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs-retained-holdings?oclcNumber=1696940&heldInState=IL");
	});
	
	it('Creates url filter by group - checkRetentions', () => {
		let url = lib.createRequestURL('checkRetentions', '27972555', 'heldByGroup', 'EAST')
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs-retained-holdings?oclcNumber=27972555&heldByGroup=EAST");
	});
	
	it('Creates url filter by state - getRetentions', () => {
		let url = lib.createRequestURL('getRetentions', '1696940', 'heldInState', 'IL')
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs-retained-holdings?oclcNumber=1696940&heldInState=IL");
	});
	
	it('Creates url filter by group - getRetentions', () => {
		let url = lib.createRequestURL('getRetentions', '27972555', 'heldByGroup', 'EAST')
		expect(url).to.equal("https://americas.discovery.api.oclc.org/worldcat/search/v2/bibs-retained-holdings?oclcNumber=27972555&heldByGroup=EAST");
	});
});
