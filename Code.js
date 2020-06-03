const worldcatSearchBaseURL = 'https://americas.discovery.api.oclc.org/worldcat/v2'

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Custom Menu')
      .addItem('Add API Credentials', 'showDialog')
      .addSeparator()
      .addItem('Get Current OCLC Number', 'fillCurrentOCLCNumber')
      .addSeparator()
      .addItem('Get MergedOCNs', 'fillMergedOCNs')        
      .addSeparator()
      .addItem('Get basic Metadata', 'fillMetadata')
      .addSeparator()
      .addItem('Check Holding Status', 'showCheckHoldingsDialog')
      .addSeparator()
      .addItem('Get Holdings Count', 'showGetHoldingsCountDialog')      
      .addSeparator()      
      .addItem('Check Retentions', 'showCheckRetentionsDialog')
      .addSeparator()
      .addItem('Get Retentions', 'showGetRetentionsDialog')      
      .addToUi();
}

function onInstall() {
  onOpen();
}


function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('OCLC Lookup:')
      .setWidth(500);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showSidebar(html);    
}

function showDialog() {
	  var html = HtmlService.createHtmlOutputFromFile('Page')
	      .setWidth(400)
	      .setHeight(300);
	  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
	      .showModalDialog(html, 'Enter API Credentials');
	}

function showCheckHoldingsDialog() {
	  var html = HtmlService.createHtmlOutputFromFile('CheckHoldings')
	      .setWidth(400)
	      .setHeight(300);
	  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
	      .showModalDialog(html, 'Enter Filter Criteria');
	}

function showGetHoldingsCountDialog() {
	  var html = HtmlService.createHtmlOutputFromFile('GetHoldingsCount')
	      .setWidth(400)
	      .setHeight(300);
	  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
	      .showModalDialog(html, 'Enter Filter Criteria');
	}

function showCheckRetentionsDialog() {
	  var html = HtmlService.createHtmlOutputFromFile('CheckRetentions')
	      .setWidth(400)
	      .setHeight(300);
	  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
	      .showModalDialog(html, 'Enter Filter Criteria');
	}

function showGetRetentionsDialog() {
	  var html = HtmlService.createHtmlOutputFromFile('GetRetentions')
	      .setWidth(400)
	      .setHeight(300);
	  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
	      .showModalDialog(html, 'Enter Filter Criteria');
	}

function saveCredentials(form) {
   
   var ui = SpreadsheetApp.getUi();
   
   //MAKE SURE THE OCLC API KEY AND SECRET HAVE BEEN ENTERED
   let apiKey = form.apiKey;
   let secret = form.apiSecret;
   if (apiKey == null || apiKey == "" || secret == null || secret == "") {
     ui.alert("OCLC API Key and Secret are Required");
     return;
   }
   PropertiesService.getUserProperties().setProperty('apiKey', apiKey);
   PropertiesService.getUserProperties().setProperty('secret', secret);
 }

function getStoredAPIKey() {
    return PropertiesService.getUserProperties().getProperty('apiKey')
 }

function getStoredAPISecret() {
    return PropertiesService.getUserProperties().getProperty('secret')
 }

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('WorldCat API')
      // Set the endpoint URLs.
      .setTokenUrl('https://oauth.oclc.org/token')

      // Set the client ID and secret.
      .setClientId(PropertiesService.getUserProperties().getProperty('apiKey'))
      .setClientSecret(PropertiesService.getUserProperties().getProperty('secret'))

      // Sets the custom grant type to use.
      .setGrantType('client_credentials')
      .setScope('DISCOVERY')
  
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

function fillCurrentOCLCNumber(){

	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();
	  for(var row = 1; row < bookValues.length; row++){
		  let bib = getMetadata(bookValues[row][0])		 
		  bookValues[row][1] = bib.oclcNumber;
	  }
	  
	  dataRange.setValues(bookValues); 
}

function fillHoldingStatus(form){
	let filterType = form.filterType;
	let filterValue = form.filterValue;
	if (filterType == null || filterType == "" || filterValue == null || filterValue == "") {
		ui.alert("Filter parameters are required!");
	 return;
	}	
	
	var dataRange = SpreadsheetApp.getActiveSpreadsheet()
		.getDataRange();
	var bookValues = dataRange.getValues();
	for(var row = 1; row < bookValues.length; row++){
		  let status = getHoldingStatus(bookValues[row][0], filterType, filterValue)		 
		  bookValues[row][2] = status
	}
	  
	dataRange.setValues(bookValues);
}

function fillMetadata(){
	  // Constants that identify the index of the title, author,
	  // and ISBN columns (in the 2D bookValues array below). 
	  var OCLCNUM_COLUMN = 0;
	  var CURRENT_OCLCNUM_COLUMN = 1;
	  var HOLDINGS_COLUMN = 2;	  
	  var TITLE_COLUMN = 3;
	  var AUTHOR_COLUMN = 4;
	  var ISBN_COLUMN = 5;
	  var MERGEDOCNS_COLUMN = 6;

	  // Get the current book information in the active sheet. The data
	  // is placed into a 2D array.
	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();

	  // Examine each row of the data (excluding the header row).
	  // If an ISBN is present and a title or author is missing,
	  // use the fetchBookData_(isbn) method to retrieve the
	  // missing data from the Open Library API. Fill in the
	  // missing titles or authors when they are found.
	  for(var row = 1; row < bookValues.length; row++){   	   

	      var bookData = getMetadata(bookValues[row][0]);

	      // Sometimes the API doesn't return the information needed.
	      // In those cases, don't attempt to update the row further.
	      if (!bookData) {
	        continue;
	      }

	      // The API might not have a title, so only fill it in
	      // if the API returns one
	      if(bookData.isbns){
	    	  console.log(bookData.isbns)
	        bookValues[row][ISBN_COLUMN] = bookData.isbns; 
	      }
	      
	      // The API might not have a title, so only fill it in
	      // if the API returns one
	      if(bookData.title){
	        bookValues[row][TITLE_COLUMN] = bookData.title; 
	      }

	      // The API might not have an author name, so only fill it in
	      // if the API returns one
	      if(bookData.author){
	        bookValues[row][AUTHOR_COLUMN] =
	          bookData.author; 
	      }
	      
	      if(bookData.mergedOCNs){
		        bookValues[row][MERGEDOCNS_COLUMN] =
		          bookData.mergedOCNs; 
		      }
	  }
	  
	  // Put the updated book data values back into the spreadsheet.
	  dataRange.setValues(bookValues);   
	}

function fillMergedOCNs(){

	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();
	  for(var row = 1; row < bookValues.length; row++){
		  let bib = getMetadata(bookValues[row][0])		 
		  bookValues[row][6] = bib.mergedOCNs;
	  }
	  
	  dataRange.setValues(bookValues); 
}

function fillHoldingCount(form){
	let filterValue = form.filterValue;
	if (filterValue == null || filterValue == "") {
		ui.alert("Filter parameters are required!");
     return;
	}	
	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();
	  for(var row = 1; row < bookValues.length; row++){  
		  var holdingsCount = getHoldingsCount(bookValues[row][0], filterValue);
		  bookValues[row][7] = holdingsCount;
	  }
	  
	  dataRange.setValues(bookValues);	
}

function fillRetentionCheck(form){
	var ui = SpreadsheetApp.getUi();	
	let filterType = form.filterType;
	let filterValue = form.filterValue;
	if (filterType == null || filterType == "" || filterValue == null || filterValue == "") {
		ui.alert("Filter parameters are required!");
     return;
	}		
	var dataRange = SpreadsheetApp.getActiveSpreadsheet()
		.getDataRange();
	var bookValues = dataRange.getValues();
	for(var row = 1; row < bookValues.length; row++){  
		var retentionCheck = checkRetentions(bookValues[row][0], filterType, filterValue);
		bookValues[row][8] = retentionCheck;
	}
	  
	dataRange.setValues(bookValues);
}

function fillRetentionInfo(form){
	var ui = SpreadsheetApp.getUi();	
	let filterType = form.filterType;
	let filterValue = form.filterValue;
	if (filterType == null || filterType == "" || filterValue == null || filterValue == "") {
		ui.alert("Filter parameters are required!");
		return;
	}		
	var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	.getDataRange();
	var bookValues = dataRange.getValues();
	for(var row = 1; row < bookValues.length; row++){  
		var retentionInfo = getRetentions(bookValues[row][0], filterType, filterValue);
		bookValues[row][9] = retentionInfo;
	}
	dataRange.setValues(bookValues);	
}

function getMetadata(oclcNumber){
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = worldcatSearchBaseURL + '/bibs/' + oclcNumber;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bib = Metadata.getBasicMetadata(response.getContentText());	    
		return bib	    	    
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function getHoldingStatus(oclcNumber, filterType, filterValue){
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = worldcatSearchBaseURL + '/bibs?q=no:' + oclcNumber + '&' + filterType + '=' + filterValue;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bib_results = JSON.parse(response.getContentText());	 
	    let holdingStatus = ""
	    if (bib_results.numberOfRecords > 0) {
	    	holdingStatus = "TRUE"
	    } else {
	    	holdingStatus = "FALSE"
	    }
		return holdingStatus
	  } else {
	    Logger.log(service.getLastError());
	  }	
}

function getHoldingsCount(oclcNumber, country){
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = worldcatSearchBaseURL + '/bibs-holdings?oclcNumber=' + oclcNumber + '&heldInCountry=' + country;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bib_holding_results = JSON.parse(response.getContentText());	    
		let holdingsCount = bib_holding_results.briefRecords[0].institutionHolding.totalHoldingCount
		return holdingsCount
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function checkRetentions(oclcNumber, filterType, filterValue){
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = worldcatSearchBaseURL + '/bibs-retained-holdings?oclcNumber=' + oclcNumber + '&' + filterType + '=' + filterValue;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bibRetainedHoldings = JSON.parse(response.getContentText());	    
		let numberOfRecords = bibRetainedHoldings.numberOfRecords
		if (numberOfRecords == 0){
			return "FALSE"
		} else {
			return "TRUE"
		}
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function getRetentions(oclcNumber, filterType, filterValue){
	  var service = getService();
	  if (service.hasAccess()) {
		var url = worldcatSearchBaseURL + '/bibs-retained-holdings?oclcNumber=' + oclcNumber + '&' + filterType + '=' + filterValue;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bibRetainedHoldings = JSON.parse(response.getContentText());	    
        if (bibRetainedHoldings.numberOfRecords == 0){
            return "None"
        } else {  
			let retentionSet = bibRetainedHoldings.briefRecords[0].institutionHolding.briefHoldings
			let oclcSymbolsRetentions = retentionSet.map(retention => retention.oclcSymbol)
			return oclcSymbolsRetentions.join();
        }
	  } else {
	    Logger.log(service.getLastError());
	  }
}