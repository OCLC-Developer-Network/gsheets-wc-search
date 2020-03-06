class Bib {
	constructor(result){
		this.record = JSON.parse(result);
	}
	function getID(){
		return this.record.identifier.oclcNumber	    
	}
	
	function getOCLCNumber(){
		return this.record.identifier.oclcNumber
	}
	
	function getTitle(){
		let title = this.title.mainTitles[0]
		title = title.replace(/\s\/+$/, "")
		return title;
	}
	
	function getAuthor(){
		let author = this.record.contributor.creators[0].secondName.text + ', ' + this.record.contributor.creators[0].firstName.text
	
		return author;
	}
	function getISBNs(){
		let isbns = this.record.identifier.isbns
		return isbns.join()	
			
	}
	
	function getMergedOCLCNumbers(){
		let mergedOclcNumbers = this.record.identifier.mergedOclcNumbers
		return mergedOclcNumbers.join()
	}
}

module.exports = Bib
