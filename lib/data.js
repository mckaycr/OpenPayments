var path = require('path');
var def = require(__dirname + path.sep + 'definitions.json');

function datasets(){
	this.get = function(callback){
		check(function(results){
			if(results){
				find(function(data){
					update(data,function(){
						callback(def)
					})
				})
			}else{
				callback(def)
			}
		})
	}
}
module.exports = new datasets();

function check(callback){
	var x = new Date(getDate());
		var y = new Date(def.datasets.ver_ctrl.updated)
		if(x>y){
			callback(true)
		}else{
			callback(false)
	}
}

function find(callback){
	var soda = require('soda-js');
		var request = new soda.Consumer('openpaymentsdata.cms.gov');
		var searchFiles = {}
		var datasets=[]
		request.query()
			.withDataset('89ej-cy77')
			.getRows()
				.on('success',function(rows){
					organize_datasets(def.datasets,rows, function(results){
						callback(results)
					})
				})
				.on('error',function(error){callback(error)})
}
function update(newDefs,callback){
	var fs = require('fs');
	var fileName = __dirname + path.sep + 'definitions.json';
	var file = require(fileName);

	file.datasets = newDefs;

	fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
	  if (err) return console.log(err);
	  callback()
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
function organize_datasets(original,rows, callback){
	var datasets=original
	var types = ['general','research','ownership']
	var today = new Date()
	rows.forEach(function(row){
		arrName = row.dataset_name.split(' ')
		type = arrName[0].toLowerCase()
		if(arrName.length==9){
			year = arrName[6]
		}else{
			
			year = today.getFullYear()-1
		}
		if(types.includes(type)){
			console.log(type + ' is a payment type')
			if(datasets.hasOwnProperty(type)){
				datasets[type][year]=row.dataset_id
			}else{
				datasets[type] = {[year]:row.dataset_id}
			}
		}else{
			console.log(type + ' is a entity type')
			//if(datasets.hasOwnProperty(type)){
				datasets[type]=row.dataset_id
			//}else{
			//	datasets = {[type]:row.dataset_id}
			//}
		}
		if(datasets.hasOwnProperty('ver_ctrl')){
			datasets.ver_ctrl.updated = getDate()
		}else{
			datasets.ver_ctrl = {updated:getDate()}
		}
	})
	callback(datasets)	
}