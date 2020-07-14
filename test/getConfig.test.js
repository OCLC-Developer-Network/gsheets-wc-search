const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');
const sinon = require('sinon');
const mocks = require("./mocks/gas-mocks");


const lib = gas.require('./src', mocks);

describe('when PropertiesService stubbed', () => {
	after(() => {
    	lib.PropertiesService.getUserProperties.restore();
      });
	describe('Get configuration data', () => {
		it('returns a valid configuration object', () => {
			let mockProperties = new mocks.Properties()
			mockProperties.setProperty('apiKey', 'key')
			mockProperties.setProperty('secret', 'secret')
			mockProperties.setProperty('institutionSymbol', 'OCPSB')
		    sinon.stub(mocks.PropertiesService, 'getUserProperties').returns(mockProperties);	    
		    let config = lib.getConfig();
		    expect(config).to.be.an("object");
			expect(config.apiKey).to.equal('key');
			expect(config.apiSecret).to.equal('secret');
			expect(config.institutionSymbol).to.equal('OCPSB');
		});	
	});
});