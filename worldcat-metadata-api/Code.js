const baseURL = 'https://worldcat.org'

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Custom Menu')
      .addItem('Add API Credentials', 'showDialog')
      .addSeparator()
      .addItem('Get Current OCLC Number', 'fillCurrentOCLCNumber')
      .addSeparator()
      .addItem('Check Holdings', 'fillHoldings') 
      .addSeparator()
      .addItem('Get basic Metadata', 'fillMetadata')       
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
  return OAuth2.createService('WorldCat Metadata API')
      // Set the endpoint URLs.
      .setTokenUrl('https://oauth.oclc.org/token')

      // Set the client ID and secret.
      .setClientId(PropertiesService.getUserProperties().getProperty('apiKey'))
      .setClientSecret(PropertiesService.getUserProperties().getProperty('secret'))

      // Sets the custom grant type to use.
      .setGrantType('client_credentials')
      .setScope('WorldCatMetadataAPI')
  
      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

function fillCurrentOCLCNumber(){

	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();
	  for(var row = 1; row < bookValues.length; row++){
		  var currentOCLCNumber = getCurrentOCLCNumber(bookValues[row][0]);
		  bookValues[row][1] = currentOCLCNumber;
	  }
	  
	  dataRange.setValues(bookValues); 
}

function fillHoldings(){
	  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
	    .getDataRange();
	  var bookValues = dataRange.getValues();
	  for(var row = 1; row < bookValues.length; row++){  
		  var holdingsFlag = checkHoldings(bookValues[row][0]);
		  bookValues[row][2] = holdingsFlag;
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
	  }
	  
	  // Put the updated book data values back into the spreadsheet.
	  dataRange.setValues(bookValues);   
	}

function getCurrentOCLCNumber(oclcNumber) {
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = baseURL + '/bib/checkcontrolnumbers?oclcNumbers=' + oclcNumber;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken(),
	        Accept: 'application/json'
	      }
	    });
	    var result = JSON.parse(response.getContentText());
	    return result.entry[0].currentOclcNumber
	  } else {
	    Logger.log(service.getLastError());
	  }
	}

function checkHoldings(oclcNumber) {
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = baseURL + '/ih/checkholdings?oclcNumber=' + oclcNumber;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken(),
	        Accept: 'application/json'	        
	      }
	    });
	    var result = JSON.parse(response.getContentText());
	    return result.isHoldingSet
	  } else {
	    Logger.log(service.getLastError());
	  }
	}

function getMetadata(oclcNumber){
	  var service = getService();
	  if (service.hasAccess()) {
	    var url = baseURL + '/bib/data/' + oclcNumber;
	    var response = UrlFetchApp.fetch(url, {
	      headers: {
	        Authorization: 'Bearer ' + service.getAccessToken()        
	      }
	    });
	    var content = parseMARCFromXML(response.getContentText());
	    let bib = appLibrary.parseMarcData(content)
	    return bib
	    
	  } else {
	    Logger.log(service.getLastError());
	  }
}

function parseMARCFromXML(responseXML){
	var result = XmlService.parse(responseXML);
    var root = result.getRootElement();
    var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
    var rb = XmlService.getNamespace('http://worldcat.org/rb');
    var marc = XmlService.getNamespace('http://www.loc.gov/MARC21/slim');
    var entries = root.getChildren('content', atom);
    var content = entries[0].getChild('response', rb).getChild('record', marc);
    var xml = XmlService.getCompactFormat().format(content);
    return xml
}