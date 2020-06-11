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
      .addItem('Check My Holding Status', 'fillMyHoldingStatus')
      .addSeparator()      
//      .addItem('Check Holding Status', 'showCheckHoldingsDialog')
//      .addSeparator()
      .addItem('Get Holdings Count', 'showGetHoldingsCountDialog')      
      .addSeparator()
      .addItem('Get Holdings', 'showGetHoldingsDialog')      
      .addSeparator()      
      .addItem('Check Retentions', 'showCheckRetentionsDialog')
      .addSeparator()
      .addItem('Get Retentions', 'showGetRetentionsDialog')      
      .addToUi();
}

function onInstall() {
  onOpen();
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

function showGetHoldingsDialog() {
	  var html = HtmlService.createHtmlOutputFromFile('GetHoldings')
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
   let institutionSymbol = form.institutionSymbol;
   if (apiKey == null || apiKey == "" || secret == null || secret == "" || institutionSymbol == null || institutionSymbol == "") {
     ui.alert("OCLC API Key, Secret and Institution Symbol are Required");
     return;
   }
   PropertiesService.getUserProperties().setProperty('apiKey', apiKey);
   PropertiesService.getUserProperties().setProperty('secret', secret);   
   PropertiesService.getUserProperties().setProperty('institutionSymbol', institutionSymbol);
 }

function getConfig() {
    let config = new Object();
	config.apiKey = PropertiesService.getUserProperties().getProperty('apiKey')
    config.apiSecret = PropertiesService.getUserProperties().getProperty('secret')
    config.institutionSymbol = PropertiesService.getUserProperties().getProperty('institutionSymbol')
    return config;
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
  return OAuth2.createService('WorldCat Search API')
      // Set the endpoint URLs.
      .setTokenUrl('https://oauth.oclc.org/token')

      // Set the client ID and secret.
      .setClientId(PropertiesService.getUserProperties().getProperty('apiKey'))
      .setClientSecret(PropertiesService.getUserProperties().getProperty('secret'))

      // Sets the custom grant type to use.
      .setGrantType('client_credentials')
      .setScope('wcapi')
  
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

function fillMyHoldingStatus(){		
	var dataRange = SpreadsheetApp.getActiveSpreadsheet()
		.getDataRange();
	var bookValues = dataRange.getValues();
	for(var row = 1; row < bookValues.length; row++){
		  let status = getHoldingStatus(bookValues[row][0], 'heldBy', PropertiesService.getUserProperties().getProperty('institutionSymbol'))		 
		  bookValues[row][2] = status
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
	  // missing data from the Open appLibrary API. Fill in the
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
	      if(bookData.isbns && bookData.isbns.length > 0){
	        bookValues[row][ISBN_COLUMN] = bookData.isbns.join('|');
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
	      
	      if(bookData.mergedOCNs && bookData.mergedOCNs.length > 0){
		        bookValues[row][MERGEDOCNS_COLUMN] =
		          bookData.mergedOCNs.join('|'); 
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

function fillHoldings(form){
	let filterValue = form.filterValue;
	if (filterValue == null || filterValue == "") {
		ui.alert("Filter parameters are required!");
     return;
	}	
	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();
	  for(var row = 1; row < bookValues.length; row++){  
		  var holdings = getHoldings(bookValues[row][0], filterValue);
		  bookValues[row][8] = holdings;
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
		bookValues[row][9] = retentionCheck;
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
		bookValues[row][10] = retentionInfo;
	}
	dataRange.setValues(bookValues);	
}

function getMetadata(oclcNumber){
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = createRequestURL('getMetadata', oclcNumber)
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bib = getBasicMetadata(response.getContentText());	    
		return bib	    	    
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function getHoldingStatus(oclcNumber, filterType, filterValue){
	  var service = getService();
	  if (service.hasAccess()) {
		var url = createRequestURL('getHoldingStatus', oclcNumber, filterType, filterValue)
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });	 
	    let holdingStatus = parseHoldingStatus(response.getContentText())
		return holdingStatus
	  } else {
	    Logger.log(service.getLastError());
	  }	
}

function getHoldingsCount(oclcNumber, country){
	  var service = getService();
	  if (service.hasAccess()) {
		var url = createRequestURL('getHoldingsCount', oclcNumber, 'heldInCountry', country)
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let holdingsData = parseHoldingsData(response.getContentText());	    
		return holdingsData.totalHoldingCount
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function getHoldings(oclcNumber, country){
	  var service = getService();
	  if (service.hasAccess()) {
		var url = createRequestURL('getHoldings', oclcNumber, 'heldInCountry', country)
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let holdingsData = parseHoldingsData(response.getContentText());	    
		return holdingsData.libraries.join('|')
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function checkRetentions(oclcNumber, filterType, filterValue){
	  var service = getService();
	  if (service.hasAccess()) {
		var url = createRequestURL('checkRetentions', oclcNumber, filterType, filterValue)
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
		let bibRetainedHoldings = parseRetentionsData(response.getContentText());
		if (bibRetainedHoldings.numberOfRetentions == 0){
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
		var url = createRequestURL('getRetentions', oclcNumber, filterType, filterValue)
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      },
	      validateHttpsCertificates: false
	    });
	    let bibRetainedHoldings = parseRetentionsData(response.getContentText());
	    return bibRetainedHoldings.oclcSymbolRetentions.join('|')
	  } else {
	    Logger.log(service.getLastError());
	  }
}