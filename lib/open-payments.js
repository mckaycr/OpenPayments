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
			args.query_type = 'entity'
			datasets.get(function(defs){
				query(defs,args,function(err,queries){
					callback(err,queries)
				})
			})
		}
    },
    this.summary = function(args,callback){
    	if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}else{
			args.query_type = 'summary'
			datasets.get(function(datasets){
				var results = []
		        queryList(datasets,args, function(queries){
		        	var itemsProcessed = 0;
		    		callback(queries)
		        });
		    	// queries.map(function(query){
		    	// 	sQuery(query, function(data){
		    	// 		query.data = data
		    	// 		itemsProcessed++;
		    	// 		if(itemsProcessed===queries.length){
		    	// 			summarize(queries, function(res){
		    	// 				callback(null, res)
		    	// 			})
		    	// 		}
		    	// 	})
		    	// })
			})
		}
    }
}

module.exports = new Covered_Recipient();

function query(def,entity, callback){
	var soda = require('soda-js');
	var options = {}
	var params = queryList(def,entity)
	var op = new soda.Consumer('openpaymentsdata.cms.gov', options);
	params.forEach(function(param){
		op.query()
		.withDataset(param.dataset)
		.where(param.query)
		.select(param.select)
		.getRows()
			.on('success', function(rows){callback(null, rows)})
			.on('error', function(error){callback(error)})
	})
}

function queryList(defs,entity){
	var output = [];
	switch(entity.query_type){
		case 'entity':
			output.push({
				id:entity.id,
				'type':entity.type,
				'dataset':defs.providers[entity.type],
				'query':defs.fieldName[entity.type]+"='"+entity.id+"'",
				'select':'*'
			})
		break;
		case 'summary':
			
		break;
	}
	return (output)
}


function summarize(data, callback){
	var results = {}
	data.forEach(function(dataset){
		var year = dataset.year
		var type = dataset.type
		if(!results.hasOwnProperty(year)){results[year]={}}
		if(!results[year].hasOwnProperty(type)){results[year][type] = {}}
		dataset.data.forEach(function(flag){
			for(var prop in flag){
				results[year][type][prop]=(results[year][type][prop]==null)?results[year][type][prop] = Number(flag[prop]):results[year][type][prop]=results[year][type][prop]+Number(flag[prop])
			}
		})
		if(dataset.data.length==2){
			results[year][type].disputes = {
				count:dataset.data[1].count,
				value:dataset.data[1].value
			}
		}
	})
	callback(results)
}