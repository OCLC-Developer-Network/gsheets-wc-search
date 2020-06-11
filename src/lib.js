function createRequestURL(functionName, oclcNumber, filterType, filterValue) {
	let worldcatSearchBaseURL = 'https://americas.discovery.api.oclc.org/worldcat/search/v2'
	let url = worldcatSearchBaseURL;
	if (functionName == 'getHoldingStatus'){
		url += '/bibs?q=no:' + oclcNumber + '&' + filterType + '=' + filterValue; 
	} else if (functionName == 'getHoldingsCount' || functionName == 'getHoldings'){
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
	// remove trailing space slash
	title = title.replace(/\s\/.*$/, "")
	// remove trailing period
	title = title.replace(/\.$/, "");
	
	let author = record.contributor.creators[0].secondName.text + ', ' + record.contributor.creators[0].firstName.text
	// remove trailing commas
	// remove trailing periods
	author = author.replace(/\.$/, "");	
	
	let isbns = ""
	if (record.identifier.isbns == undefined) {
		isbns = [];
	} else {
		isbns = record.identifier.isbns
	}
	
	let mergedOclcNumbers = "";
	
	if (record.identifier.mergedOclcNumbers == undefined) {
		mergedOclcNumbers = [];
	} else {
		mergedOclcNumbers = record.identifier.mergedOclcNumbers;
	}
	
	let bib = new Object(); 
	bib.oclcNumber = oclcNumber
	bib.title =  title
	bib.author = author
	bib.isbns =  isbns
	bib.mergedOCNs = mergedOclcNumbers		    		

    return bib
}

function parseHoldingStatus(result){
	let bib_results = JSON.parse(result);
	let holdingStatus = ""
    if (bib_results.numberOfRecords > 0) {
    	holdingStatus = "TRUE"
    } else {
    	holdingStatus = "FALSE"
    }
	return holdingStatus
}

function parseHoldingsData(result) {
	let bibHoldings = JSON.parse(result);
	
	let oclcSymbolHoldings = [];
    if (bibHoldings.numberOfRecords == 0 || bibHoldings.briefRecords[0].institutionHolding.briefHoldings == undefined){
    	oclcSymbolHoldings = []
    } else {  
		let holdingSet = bibHoldings.briefRecords[0].institutionHolding.briefHoldings
		oclcSymbolHoldings = holdingSet.map(holding => holding.oclcSymbol)		
    }
	
	let holdingData = new Object(); 
	holdingData.totalHoldingCount = bibHoldings.briefRecords[0].institutionHolding.totalHoldingCount
	holdingData.libraries = oclcSymbolHoldings		    		

    return holdingData
}

function parseRetentionsData(result) {
	let bibRetainedHoldings = JSON.parse(result);
	
	let numberOfRetentions = 0
	let oclcSymbolsRetentions = []
	
    if (bibRetainedHoldings.numberOfRecords == 0 || bibRetainedHoldings.briefRecords[0].institutionHolding.briefHoldings == undefined){
    	numberOfRetentions = 0
    	oclcSymbolRetentions = []
    } else {  
		let retentionSet = bibRetainedHoldings.briefRecords[0].institutionHolding.briefHoldings
		oclcSymbolRetentions = retentionSet.map(retention => retention.oclcSymbol)
		numberOfRetentions = retentionSet.length
    }
	
	let retentionData = new Object();
	retentionData.numberOfRetentions = numberOfRetentions
	retentionData.oclcSymbolRetentions = oclcSymbolRetentions		    		

    return retentionData;
}