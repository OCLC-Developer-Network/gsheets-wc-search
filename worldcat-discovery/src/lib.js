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
export {getBasicMetadata}
