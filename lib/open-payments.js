var op_configs = require('./data.js')

function Covered_Recipient(){
	this.identify = function(arguments, callback){
		var args = arguments
		if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}
		args.query='identify'
		op_configs.get(function(configs){
			setParams(args,configs,function(params){
				query(params,function(err,results){
					callback(err,results)
				})
			})
		})
	}
	this.summary = function(arguments,callback){
		var args = arguments
		var data = []
		if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}
		args.query='summary'
		var items_processed = 0
		op_configs.get(function(configs){
			setParams(args,configs,function(params){
				query(params,function(err,results){
					callback(err,results)
				})
			})
		})
	}
}
module.export = new Covered_Recipient

//var options = {id:'844023',type:'physician'}
var options = {id:'100000000278',type:'company'}
var cr = new Covered_Recipient

cr.identify(options,function(err,results){
	console.log(err)
	console.log(results)
})
cr.summary(options,function(err,results){
	if(err){console.log(err)}
	console.log(results)
})

function setParams(entity, configs, callback){
	var params = []
	switch(entity.query){
		case 'identify':
			params.push({dataset:configs.providers[entity.type],where:configs.fieldName[entity.type]+"='"+entity.id+"'",select:"*",group:""});
		break;
		case 'summary':
			for(var pts in configs.datasets){
				var pt = configs.datasets[pts]
				for(var py in pt){
					params.push({
						program_year:py,
						payment_type:pts,
						dataset:configs.datasets[pts][py],
						where:configs.fieldName[entity.type]+"='"+entity.id+"'",
						select:configs.selects[pts],
						group:'dispute_status_for_publication'
					})
					if(pts=='research' && entity.type=="physician"){
						params.push({
						program_year:py,
						payment_type:'pi',
						dataset:configs.datasets[pts][py],
						where:"physician_profile_id IS NULL OR physician_profile_id!='"+entity.id+"') AND (principal_investigator_1_profile_id='"+entity.id+"' OR principal_investigator_2_profile_id='"+entity.id+"' OR principal_investigator_3_profile_id='"+entity.id+"' OR principal_investigator_4_profile_id='"+entity.id+"' OR principal_investigator_5_profile_id='"+entity.id+"'",
						select:configs.selects['pi'],
						group:'dispute_status_for_publication'
					})
					}
				}
			}
		break;
	}
	callback(params)
}

function query(params, callback){
	var soda = require('soda-js');
	var options = {}
	var op = new soda.Consumer('openpaymentsdata.cms.gov', options);
	var data = [];
	var items_processed = 0;
	params.forEach(function(param){
		op.query()
		.withDataset(param.dataset)
		.where(param.where)
		.select(param.select)
		.group(param.group)
		.getRows()
			.on('success', function(rows){
				items_processed++;
				if(param.hasOwnProperty('payment_type') && rows.length>0){
					rows.forEach(function(row){
						row.payment_type = param.payment_type
						row.program_year = param.program_year
						data.push(row);
						if(items_processed===params.length){
							summarize(data,function(results){
								callback(null,results)
							})
						}
					})
				}else if(rows.length!=0){
					callback(null,rows)
				}
			})
			.on('error', function(error){callback(error)})
	})
}
function summarize(data, callback){
	var results = {}
	data.forEach(function(element){
		if(!results.hasOwnProperty(element.program_year)){results[element.program_year]={}}
		if(!results[element.program_year].hasOwnProperty(element.payment_type)){results[element.program_year][element.payment_type]={}}
		if(element.disputed=="Yes"){
			results[element.program_year][element.payment_type].disputed = {count:element.count,value:element.value}
		}else{
			results[element.program_year][element.payment_type].undisputed = {count:element.count,value:element.value}
		}
	})
	callback(results)
}