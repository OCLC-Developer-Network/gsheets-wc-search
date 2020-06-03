const worldcatSearchBaseURL = 'https://americas.discovery.api.oclc.org/worldcat/search/v2'
	
function createRequestURL(functionName, oclcNumber, filterType, filterValue) {
	let url = worldcatSearchBaseURL;
	if (functionName == 'getHoldingStatus'){
		url += '/bibs?q=no:' + oclcNumber + '&' + filterType + '=' + filterValue; 
	} else if (functionName == 'getHoldingsCount'){
		url += '/bibs-holdings?oclcNumber=' + oclcNumber + '&' + filterType + '=' + filterValue;
	} else if (functionName == 'checkRetentions' || functionName == 'getRetentions'){
		url += '/bibs-retained-holdings?oclcNumber=' + oclcNumber + '&' + filterType + '=' + filterValue;		
	} else {
		url += '/bibs/' + oclcNumber
	}

	return url
}

function getBasicMetadata(result) {
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

function getHoldingStatus(result){
	let bib_results = JSON.parse(result);
	let holdingStatus = ""
    if (bib_results.numberOfRecords > 0) {
    	holdingStatus = "TRUE"
    } else {
    	holdingStatus = "FALSE"
    }
	return holdingStatus
}

function getHoldingsData(result) {
	let bibHoldings = JSON.parse(result);
	
    if (result.numberOfRecords == 0 || bibHoldings.briefRecords[0].institutionHolding.briefHoldings == null){
    	oclcSymbolsHoldings = []
    } else {  
		let holdingSet = bibHoldings.briefRecords[0].institutionHolding.briefHoldings
		let oclcSymbolsHoldings = holdingSet.map(holding => holding.oclcSymbol)		
    }
	
	let holdingData = new Object(); 
	holdingData.totalHoldingCount = result.briefRecords[0].institutionHolding.totalHoldingCount
	holdingData.libraries = oclcSymbolsHoldings		    		

    return holdingData
}

function getRetentionsData(result) {
	let bibRetainedHoldings = JSON.parse(result);
	
    if (bibRetainedHoldings.numberOfRecords == 0){
    	oclcSymbolsRetentions = []
    } else {  
		let retentionSet = bibRetainedHoldings.briefRecords[0].institutionHolding.briefHoldings
		let oclcSymbolsRetentions = retentionSet.map(retention => retention.oclcSymbol)		
    }
	
	let retentionData = new Object();
	retentionData.numberOfRecords = bibRetainedHoldings.numberOfRecords
	retentionData.oclcSymbolsRetentions = oclcSymbolsRetentions		    		

    return retentionData
}

export {getBasicMetadata, getHoldingStatus, getHoldingsData, getRetentionsData, createRequestURL}
