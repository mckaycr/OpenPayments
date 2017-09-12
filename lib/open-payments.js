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
			args.query_type = 'summary'
			
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

function queryList(def,entity){
	var datasets = def.datasets
	var output = [];
	switch(entity.query_type){
		case 'entity':
			output.push({id:entity.id,'type':entity.type,'dataset':datasets[entity.type],'query':def.fieldName[entity.type]+"='"+entity.id+"'",'select':'*'})
			break;
		case 'summary':
			break;
	}
	return output;
}

function createQueries(entityObj){
    var publications = def.datasets;
    var output = [];
    for (var proYear in publications){
        var publication = publications[proYear];
        for (var paymentType in publication) {
            if(entityObj.type=='physician'&&paymentType=='pi'){
                    output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':"physician_profile_id IS NULL OR physician_profile_id!='"+entityObj.id+"') AND (principal_investigator_1_profile_id='"+entityObj.id+"' OR principal_investigator_2_profile_id='"+entityObj.id+"' OR principal_investigator_3_profile_id='"+entityObj.id+"' OR principal_investigator_4_profile_id='"+entityObj.id+"' OR principal_investigator_5_profile_id='"+entityObj.id+"'"});
            }
            switch(entityObj.type){
                case 'company':
                	if(paymentType!='pi'){
                		output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':"applicable_manufacturer_or_applicable_gpo_making_payment_id='"+entityObj.id+"'"});
                	}
                    break;
                case 'hospital':
                	if(paymentType!='ownership'&&paymentType!='pi'){
                		output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':def.searchFile.fieldName[entityObj.type]+"='"+entityObj.id+"'"});
                	}
                	break;
                default:
                    output.push({id:entityObj.id,'year':proYear,'type':paymentType,'ep':def.datasets[proYear][paymentType],'group':'dispute_status_for_publication','select':def.selects[paymentType],'query':def.searchFile.fieldName[entityObj.type]+"='"+entityObj.id+"'"});
                    break;
            }
        }
    }
    return output;
}