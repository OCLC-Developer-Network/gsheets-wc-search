const expect = require('chai').expect;
const fs = require('fs');
const gas = require('gas-local');
const sinon = require('sinon');
const mocks = require("./mocks/gas-mocks");


const lib = gas.require('./src', mocks);

describe('when Google App Script classes stubbed', () => {
	describe('process form data', () => {
		it('saves valid configuration data', () => {
			let mockProperties = new mocks.Properties()
			sinon.stub(mocks.PropertiesService, 'getUserProperties').returns(mockProperties);
			let form = {
					apiKey: 'key',
					apiSecret: 'secret',
					institutionSymbol: 'OCPSB'
					
			}
		    lib.saveCredentials(form);
			
			expect(mockProperties.getProperty('apiKey')).to.equal('key');
			expect(mockProperties.getProperty('secret')).to.equal('secret');
			expect(mockProperties.getProperty('institutionSymbol')).to.equal('OCPSB');			
		});	
	});
	describe('process form data missing', () => {
		let stub = sinon.stub(lib, 'showAlert')
		it('validates configuration data missing key', () => {			
			let form = {
					apiKey: '',
					apiSecret: 'secret',
					institutionSymbol: 'OCPSB'
					
			}
		    lib.saveCredentials(form);
			
			expect(stub.calledOnce)
			expect(stub.args[0][0]).to.equal('OCLC API Key, Secret and Institution Symbol are Required');
		});
		
		it('validates configuration data missing secret', () => {
			let form = {
					apiKey: 'key',
					apiSecret: '',
					institutionSymbol: 'OCPSB'
					
			}
		    lib.saveCredentials(form);
			
			expect(stub.calledOnce)
			expect(stub.args[0][0]).to.equal('OCLC API Key, Secret and Institution Symbol are Required');
		});
		
		it('validates configuration data missing symbol', () => {
			let form = {
					apiKey: 'key',
					apiSecret: 'secret',
					institutionSymbol: ''
					
			}
		    lib.saveCredentials(form);
			
			expect(stub.calledOnce)
			expect(stub.args[0][0]).to.equal('OCLC API Key, Secret and Institution Symbol are Required');
		});
	});	
});