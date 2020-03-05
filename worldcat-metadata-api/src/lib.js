const marc4js = require('marc4js');

function parseMarc(marcString) {
	return new Promise(function (resolve, reject) {
		marc4js.parse(record, {fromFormat: 'marcxml'}, function(err, records) {
				resolve(records[0]);
			})
			.catch (err => {
      			reject(err);
      		});
	})
}
function getID(record){
	var field_001 = record.controlFields.filter(controlField => controlField.tag === '001')[0].data
    if (isNaN(field_001)) {
    	id = field_001.slice(3); 
    } else {
    	id = field_001;
    }
    return id
}

function getOCLCNumber(record){
	return record.controlFields.filter(controlField => controlField.tag === '001')[0].data;
}

function getTitle(record){
	let title = record.dataFields.filter(dataField => String(dataField.tag).startsWith('24'))[0].findSubfield('a').data;
	if (record.dataFields.filter(dataField => String(dataField.tag).startsWith('24'))[0].findSubfield('b')){
		title += record.dataFields.filter(dataField => String(dataField.tag).startsWith('24'))[0].findSubfield('b').data;
	}
	title = title.replace(/\s\/$/, "")
	return title;
}

function getAuthor(record){
	let author;
	if (record.dataFields.filter(dataField => dataField.tag === '100')) {
		author = record.dataFields.filter(dataField => dataField.tag === "100")[0].findSubfield('a').data;
	} else if (record.dataFields.filter(dataField => dataField.tag === '110')) {
		author = record.dataFields.filter(dataField => dataField.tag === "110")[0].findSubfield('a').data;
	} else if (record.dataFields.filter(dataField => dataField.tag === '111')){
		author = record.dataFields.filter(dataField => dataField.tag === "111")[0].findSubfield('a').data;
	} else if (record.dataFields.filter(dataField => dataField.tag === '700')) {
		author = record.dataFields.filter(dataField => dataField.tag === "700")[0].findSubfield('a').data;
	} else if (record.dataFields.filter(dataField => dataField.tag === '710')) {
		author = record.dataFields.filter(dataField => dataField.tag === '710')[0].findSubfield('a').data;
	} else if (record.dataFields.filter(dataField => dataField.tag === '711')) {
		author = record.dataFields.filter(dataField => dataField.tag === "711")[0].findSubfield('a').data;
	} else {
		author = "";
	}
	author = title.replace(/\,$/, "")
	author = title.replace(/\.$/, "")

	return author;
}
function getISBNs(record){
	isbnNodes = record.dataFields.filter(dataField => dataField.tag === '020')
	isbnSet = isbnNodes.map(isbn => isbn.findSubfield('a').data)
	return isbnSet.join()	
		
}

export {
	parseMarc,
	getID,
	getOCLCNumber,
	getTitle,
	getAuthor,
	getISBNs
	
};
