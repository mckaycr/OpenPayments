var request = require('sync-request')
	,config = require('config');

module.exports = {
	query : function(options){
		main(options);
		return Covered_Recipient
	}	 	
};
// This object will be returned with all the results from the six queries
var Covered_Recipient = {}
// This is the main function
function main(options){
	var datasets = buildArr();
	var Entity_type = options.type + '_id'
	Covered_Recipient[Entity_type] = options.id
	datasets.forEach(function(e){
		getResults(e[0],e[1],options.id);
	})
}
// This function reads the config file and stores all the url information for the datasets you want to query.
// It will return an array of where each element contians program year, payment type, and the dataset URL with no paramerters
function buildArr(){
	var validation_messages = config.get('datasets')
	var temp = [];
	for (var key in validation_messages) {
	   if (validation_messages.hasOwnProperty(key)) {
	       var obj = validation_messages[key];
	        for (var prop in obj) {
	          if(obj.hasOwnProperty(prop)){
	            temp.push([key,prop,obj[prop]]);
	          }
	       }
	    }
	}
	return temp
}
// This function will return a URL in the form of a string
function buildURI(program_year,payment_type,entity_id){
	switch(payment_type){
		case 'pi':
			return config.get("datasets." + program_year + "." + payment_type) + "?$$app_token="+config.get('auth.app_token')+"&$group=dispute_status_for_publication&$select=dispute_status_for_publication,sum(total_amount_of_payment_usdollars),%20count(record_id)&$where=(physician_profile_id IS NULL OR physician_profile_id!=%27"+entity_id+"%27)%20AND%20(principal_investigator_1_profile_id=%27"+entity_id+"%27%20OR%20principal_investigator_2_profile_id=%27"+entity_id+"%27%20OR%20principal_investigator_3_profile_id=%27"+entity_id+"%27%20OR%20principal_investigator_4_profile_id=%27"+entity_id+"%27%20OR%20principal_investigator_5_profile_id=%27"+entity_id+"%27)"
			break;
		default:
			return config.get("datasets." + program_year + "." + payment_type) + "?$$app_token="+config.get('auth.app_token')+config.get('params.physician.'+payment_type) + entity_id +"'"
	}
}
// This function will update the global variable Covered_recipient with all the information from each query
function getResults(program_year,payment_type,entity_id){
	var options = {
		    method: 'GET'
		    ,uri: buildURI(program_year,payment_type,entity_id)
		    ,gzip: true
		    ,json: true
		    ,auth: {
			    user: config.get('auth.user')
			    ,pass: config.get('auth.key')
		       	,sendImmediately: true
			}
		};
	var temp = request(options.method,options.uri,options).getBody('utf8')
	var arrResults = JSON.parse(temp)
	if(arrResults.length>0){
		if(!(Covered_Recipient.hasOwnProperty(program_year))){Covered_Recipient[program_year]= {}}
		if(!(Covered_Recipient[program_year].hasOwnProperty(payment_type))){Covered_Recipient[program_year][payment_type]= {}}
		arrResults.forEach(function(element){
			if(Covered_Recipient[program_year][payment_type].count==null){Covered_Recipient[program_year][payment_type].count = Number(element.count_record_id)}
			else{Covered_Recipient[program_year][payment_type].count = Covered_Recipient[program_year][payment_type].count + Number(element.count_record_id)}
			switch(payment_type){
				case 'ownership':
					if(Covered_Recipient[program_year][payment_type].interest==null){Covered_Recipient[program_year][payment_type].interest = Number(element.sum_value_of_interest)}
					else{Covered_Recipient[program_year][payment_type].interest = Covered_Recipient[program_year][payment_type].interest + Number(element.sum_value_of_interest)}
					if(Covered_Recipient[program_year][payment_type].value==null){Covered_Recipient[program_year][payment_type].value = Number(element.sum_total_amount_invested_usdollars)}
					else{Covered_Recipient[program_year][payment_type].value = Covered_Recipient[program_year][payment_type].value + Number(element.sum_total_amount_invested_usdollars)}
					break;
				default:
					if(Covered_Recipient[program_year][payment_type].value==null){Covered_Recipient[program_year][payment_type].value = Number(element.sum_total_amount_of_payment_usdollars)}
					else{Covered_Recipient[program_year][payment_type].value = Covered_Recipient[program_year][payment_type].value + Number(element.sum_total_amount_of_payment_usdollars)}
			}
			switch(element.dispute_status_for_publication){
				case 'Yes':
					if(Covered_Recipient[program_year].disputes==null){Covered_Recipient[program_year].disputes = Number(element.count_record_id)}
					else{Covered_Recipient[program_year].disputes = Covered_Recipient[program_year].disputes + Number(element.count_record_id)}
					break;
				case 'No':
					if(Covered_Recipient[program_year].undisputes==null){Covered_Recipient[program_year].undisputes = Number(element.count_record_id)}
					else{Covered_Recipient[program_year].undisputes = Covered_Recipient[program_year].undisputes + Number(element.count_record_id)}
					break;
			}
		})
	}
}
