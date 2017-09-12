var path = require('path');
var def = require(__dirname + path.sep + 'definitions.json');

function Covered_Recipient(){
    /*
     * Get Identifying Information about an Entity
     *
     * @param {args}   and object which contains an id and type; example {id:'1234', type:'physician'}
     * @param {function}  callback
     */
	this.identify = function(args, callback /*err,value*/){
		if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}
		query(args, callback)
    },
    this.get = function(){
    	find_datasets(function(data){
    		if(check_defs()){update_defs(data)}
    	})
    }
}

module.exports = new Covered_Recipient();

function query(entity, callback){
	find_datasets(function(datasets){
		var soda = require('soda-js');
		var options = {}
		var op = new soda.Consumer('openpaymentsdata.cms.gov', options);
		op.query()
			.withDataset(def.datasets[entity.type]['2016'])
			.where(def.searchFile.fieldName[entity.type]+"='"+entity.id+"'")
			.getRows()
				.on('success', function(rows){callback(null, rows)})
				.on('error', function(error){callback(error)})
	})
}

function find_datasets(callback){
	var soda = require('soda-js');
	var request = new soda.Consumer('openpaymentsdata.cms.gov');
	var searchFiles = {}
	var datasets=[]
	request.query()
		.withDataset('89ej-cy77')
		.getRows()
			.on('success',function(rows){
				organize_datasets(rows, function(results){
					callback(results)
				})
			})
			.on('error',function(error){callback(error)})

}
function organize_datasets(rows, callback){
	var datasets={}
	var today = new Date()
	rows.forEach(function(row){
		arrName = row.dataset_name.split(' ')
		type = arrName[0].toLowerCase()
		if(arrName.length==9){
			year = arrName[6]
		}else{
			
			year = today.getFullYear()-1
		}
		if(datasets.hasOwnProperty(type)){
			datasets[type][year]=row.dataset_id
		}else{
			datasets[type] = {[year]:row.dataset_id}
		}
		if(datasets.hasOwnProperty('ver_ctrl')){
			datasets.ver_ctrl.updated = getDate()
		}else{
			datasets.ver_ctrl = {updated:getDate()}
		}
	})
	callback(datasets)	
}
function check_defs(){
	var x = new Date(getDate());
	var y = new Date(def.datasets.ver_ctrl.updated)
	if(x>y){
		return true
	}else{
		return false
	}
}
function update_defs(newDefs){
	var fs = require('fs');
	var fileName = __dirname + path.sep + 'definitions.json';
	var file = require(fileName);

	file.datasets = newDefs;

	fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file,null, 2));
	  console.log('writing to ' + fileName);
	}); 
}
function getDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
	    dd = '0'+dd
	} 
	if(mm<10) {
	    mm = '0'+mm
	} 
	today = mm + '/' + dd + '/' + yyyy;
	return today;
}