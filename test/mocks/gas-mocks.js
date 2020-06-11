"use strict";
var Spreadsheets;
(function (Spreadsheets) {
    class Range {
        constructor(cells, row, column, numRows, numColumns) {
            this.cells = cells;
            this.row = row;
            this.column = column;
            this.numRows = numRows;
            this.numColumns = numColumns;
        }
        getValue() {
            return this.getValueAt(this.row - 1, this.column - 1);
        }
        getValues() {
            const values = [];
            for (let rowIndex = 0; rowIndex < this.numRows; rowIndex++) {
                const r = this.row + rowIndex - 1;
                const row = [];
                values.push(row);
                for (let colIndex = 0; colIndex < this.numColumns; colIndex++) {
                    const c = this.column + colIndex - 1;
                    row.push(this.getValueAt(r, c));
                }
            }
            return values;
        }
        setValue(value) {
            this.setValueAt(value, this.row - 1, this.column - 1);
        }
        setValues(values) {
            values.forEach((rowValue, rowIndex) => {
                const r = this.row + rowIndex - 1;
                rowValue.forEach((value, colIndex) => {
                    const c = this.column + colIndex - 1;
                    this.setValueAt(value, r, c);
                });
            });
        }
        getValueAt(row, col) {
            const rowLine = this.cells[row] || [];
            return rowLine[col] || "";
        }
        setValueAt(value, row, col) {
            while (this.cells.length <= row) {
                this.cells.push([""]);
            }
            while (this.cells[row].length <= col) {
                this.cells[row].push("");
            }
            this.cells[row][col] = value;
        }
    }
    class Sheet {
        constructor() {
            this.cells = [];
        }
        getRange(row, column, numRows = 1, numColumns = 1) {
            return new Range(this.cells, row, column, numRows, numColumns);
        }
        getLastRow() {
            return this.cells.length;
        }
        getSheetValues(startRow, startColumn, numRows, numColumns) {
            return this.getRange(startRow, startColumn, numRows, numColumns).getValues();
        }
        insertRowsAfter(afterPosition, howMany) {
            const newRows = [];
            for (let i = 0; i < howMany; i++) {
                newRows.push([""]);
            }
            this.cells.splice(afterPosition, 0, ...newRows);
        }
        clear() {
            this.cells.splice(0, this.cells.length - 1);
        }
    }
    Spreadsheets.Sheet = Sheet;
    class Spreadsheet {
        constructor(id, name) {
            this.id = id;
            this.name = name;
            this.sheets = {};
        }
        getId() {
            return this.id;
        }
        getName() {
            return this.name;
        }
        getSheetByName(name) {
            return this.sheets[name];
        }
        insertSheet(name) {
            return this.sheets[name] = new Sheet();
        }
    }
    let App = /** @class */ (() => {
        class App {
            static create(name) {
                const id = name;
                this.spreadsheets[id] = new Spreadsheet(id, name);
                return this.spreadsheets[id];
            }
            static openById(id) {
                return this.spreadsheets[id];
            }
            static clear() {
                this.spreadsheets = {};
            }
        }
        App.spreadsheets = {};
        return App;
    })();
    Spreadsheets.App = App;
})(Spreadsheets || (Spreadsheets = {}));
let SpreadsheetApp = Spreadsheets.App;

var URLFetch;
(function (URLFetch) {
    class App {
        static fetch(_url) {
            return {
                getContentText() {
                    return "";
                },
            };
        }
    }
    URLFetch.App = App;
})(URLFetch || (URLFetch = {}));
let UrlFetchApp = URLFetch.App;

var XML;
(function (XML) {
    class Attribute {
        getValue() {
            return "";
        }
    }
    class Element {
        getChildren(_name, _) {
            return [
                new Element(),
            ];
        }
        getChild(_name, _) {
            return new Element();
        }
        getChildText(name, _) {
            return name;
        }
        getAttribute(_attrName) {
            return new Attribute();
        }
    }
    class Document {
        getRootElement() {
            return new Element();
        }
    }
    class Service {
        static parse(_text) {
            return new Document();
        }
        static getNamespace(_name) {
            return;
        }
    }
    XML.Service = Service;
})(XML || (XML = {}));
let XmlService = XML.Service;

var Property;
(function (Property) {    
	class Service {
        static getDocumentProperties() {
            return new Properties();
        }
        static getScriptProperties() {
        	return new Properties();
        }
        static getUserProperties() {
        	return new Properties();
        }
    }
	Property.Service = Service;
})(Property || (Property = {}));
let PropertiesService = Property.Service

class Properties {
	constructor() {
		  this.store = {};
		  this.counter = 0;
		};

	getProperty(key) {
	  ++this.counter;
	  return this.store[key];
	};

	setProperty(key, value) {
	  this.store[key] = value;
	};

	deleteProperty(key) {
	  delete this.store[key];
	};

	getProperties() {
	  return Object.assign({}, this.store);
	};
}


module.exports = {XmlService, UrlFetchApp, SpreadsheetApp, PropertiesService}
module.exports.Properties = Properties