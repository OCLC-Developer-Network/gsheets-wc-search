module.exports = class Bib {
	constructor(result){
		this.record = JSON.parse(result);
	}
	
	getID(){
		return this.record.identifier.oclcNumber	    
	}
	
	getOCLCNumber(){
		return this.record.identifier.oclcNumber
	}
	
	getTitle(){
		let title = this.title.mainTitles[0]
		title = title.replace(/\s\/+$/, "")
		return title;
	}
	
	getAuthor(){
		let author = this.record.contributor.creators[0].secondName.text + ', ' + this.record.contributor.creators[0].firstName.text
	
		return author;
	}
	
	getISBNs(){
		let isbns = this.record.identifier.isbns
		return isbns.join()	
			
	}
	
	getMergedOCLCNumbers(){
		let mergedOclcNumbers = this.record.identifier.mergedOclcNumbers
		return mergedOclcNumbers.join()
	}
}
