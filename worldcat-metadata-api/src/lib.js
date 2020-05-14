const xpath = require('xpath')
const dom = require('xmldom').DOMParser

function parseMarcData(record){
	
	var doc = new dom().parseFromString(record)
	var select = xpath.useNamespaces({"marc": "http://www.loc.gov/MARC21/slim"});
    
    let oclcNumber = select("//marc:controlfield[@tag='001']", doc)[0].firstChild.data
	    
	let title = select("//marc:datafield[starts-with(@tag, '24')]/marc:subfield[@code='a']", doc)[0].firstChild.data
	    
	let author = select("//marc:datafield[@tag='100'or @tag='110'or @tag='700' or @tag='710']/marc:subfield[@code='a']", doc)[0].firstChild.data  
	
	//let isbnListNodes = select("//marc:datafield[@tag='020']/marc:subfield[@tag='a']", doc)
	
	//let isbnList = [];
	//while(node = isbnListNodes.iterateNext()) {
	//	isbnList.push(node.firstChild.data);
	//}
	    
	let bib = new Object(); 
	bib.oclcNumber = oclcNumber
	bib.title =  title
	bib.author = author
	//bib.isbns = isbnList.join(', ')
	return bib;
}

function getBasicMetadata (result) {
	let record = JSON.parse(result);
	
	let oclcNumber = record.identifier.oclcNumber
	let title = record.title.mainTitles[0].text
	title = title.replace(/\s\/+$/, "")

	let author = record.contributor.creators[0].secondName.text + ', ' + record.contributor.creators[0].firstName.text

	let isbns = record.identifier.isbns
	
	let isbnList = ""
	if (isbns && isbns.length > 0) {
		isbnList = isbns.join('|')
	}
	
	let mergedOclcNumbers = record.identifier.mergedOclcNumbers
	
	let mergedOCNList = ""
	if (mergedOclcNumbers && mergedOclcNumbers.length > 0) {
		mergedOCNList = mergedOclcNumbers.join('|')
	}	

	
	let bib = new Object(); 
	bib.oclcNumber = oclcNumber
	bib.title =  title
	bib.author = author
	bib.isbns =  isbnList
	bib.mergedOCNs = mergedOCNList		    		

    return bib
}

export {
	parseMarcData,
	getBasicMetadata
};
