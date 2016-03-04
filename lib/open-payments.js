var path = require('path');
var def = require(__dirname + path.sep + 'definitions.json');

function Covered_Recipient(){
    /**
     * Get Identifying Information about an Entity
     *
     * @param {args}   and object which contains an id and type; example {id:'1234', type:'physician'}
     * @param {function}  callback
     */
	this.identify = function(args, callback /*err,value*/){
		if(typeof callback !=='function'){
			throw new Error('a callback must be provided');
		}
		var request = require('request');
		var options = {
            method: 'GET'
            ,uri: (args.type=='company')?def.url+def.supplement.data[args.type]+"?$where=amgpo_making_payment_id=%27"+args.id+"%27":def.url+def.supplement.data[args.type]+def.supplement.params[args.type]+"'"+args.id+"'"
            ,gzip: true
            ,json: true
		};
		request(options, function(error, response, data){
			if(error){callback(error)}
			else{callback(null,data)}
		});
	};
}

module.exports = new Covered_Recipient();

// *******************************************
// * This function reads the definitions file and stores 
// * all the url information for the datasets you 
// * want to query. It will return an array where 
// * each element contians program year, payment type,
// * and the dataset URL with no paramerters
// *******************************************
function createQueries(entityObj){
	var datasets = def.datasets;
	var entity_type = entityObj.type;
	var output = [];
	for (var key in datasets){
        if (datasets.hasOwnProperty(key)) {
            var obj = datasets[key];
            for (var prop in obj) {
                if(entity_type!='hospital'||prop!='ownership'){
                    if(obj.hasOwnProperty(prop)){
                        switch(entity_type){
                            case 'company':
                                output.push({id:enditiyObj.id,'year':key,'type':prop,'uri':def.url+obj[prop]+'?$where=applicable_manufacturer_or_applicable_gpo_making_payment_id=%27'+enditiyObj.id+'%27'});
                                break;
                            default:
                                output.push({id:enditiyObj.id,'year':key,'type':prop,'uri':def.url+obj[prop]+def.supplement.params[entity_type] + '%27'+enditiyObj.id+'%27'});
                        }
                    }
                }else if(entity_type=='physician'&&prop=='pi'){
                    if(obj.hasOwnProperty(prop)){
                        output.push({id:enditiyObj.id,'year':key,'type':prop,'uri':def.url+obj[prop]+"$where=(physician_profile_id IS NULL OR physician_profile_id!=%27"+enditiyObj.id+"%27)%20AND%20(principal_investigator_1_profile_id=%27"+enditiyObj.id+"%27%20OR%20principal_investigator_2_profile_id=%27"+enditiyObj.id+"%27%20OR%20principal_investigator_3_profile_id=%27"+enditiyObj.id+"%27%20OR%20principal_investigator_4_profile_id=%27"+enditiyObj.id+"%27%20OR%20principal_investigator_5_profile_id=%27"+enditiyObj.id+"%27"});
                    }	
                }
            }
        }		
	}
	return output;
}

