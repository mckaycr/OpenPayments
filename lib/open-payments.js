var datasets = require('./data.js');

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
		}else{
			datasets.get(function(datasets){
				query(datasets,args,function(err,data){
					callback(err,data)
				})
			})
		}
    },
    this.summary = function(args,callback){
    	if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}else{
			
		}
    }
}

module.exports = new Covered_Recipient();

function query(def,entity, callback){
	var soda = require('soda-js');
	var options = {}
	var op = new soda.Consumer('openpaymentsdata.cms.gov', options);
	op.query()
		.withDataset(def.datasets[entity.type]['2016'])
		.where(def.searchFile.fieldName[entity.type]+"='"+entity.id+"'")
		.getRows()
			.on('success', function(rows){callback(null, rows)})
			.on('error', function(error){callback(error)})
}