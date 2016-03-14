process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'; // npm install open-payments doesn't create a config file... yet
exports = module.exports = {
	summary : function(options){
		if(config.has('datasets')===false){initialize()}  // Create a new config.json if none exists
		else{
			entityInfo(options);
			main(options);
			return Covered_Recipient;
		}
	},
	information : function(options){
		if(config.has('datasets')===false){initialize()}  // Create a new config.json if none exists
		else{
			entityInfo(options);
			return Covered_Recipient;
		}
	},
	records: function(options){
		entityInfo(options);
		getData(options);
		return Covered_Recipient;
	},
	details:function(options){
		entityInfo(options);
		getData(options);
		main(options);
		return Covered_Recipient;
	}
};
var request = require('sync-request')
	,t = require('exectimer')
	,config = require('config')
	,fs = require('fs')
	,path=require('path')
	,ua = require('universal-analytics');
	try{var pkg = require('../../../package.json')}
	catch(err){
		if(err){var pkg=require('../package.json')}
	}
	var modu = require('../package.json');
var Covered_Recipient = {}; // This object is the main output of this module.
var visitor = ua('UA-21664895-11');
var ga_params = {
	an:pkg.name,
	av:pkg.version,
	cd2:modu.version
};
// *******************************************
// * initialize() is used to (for now) to create a default
// * config file if none exists.  I'd like to move this to 
// * an install script outside this module if possible. Will
// * have to explore NPM scripts more for that I think.
// *******************************************
function initialize(){
	visitor.event('initialize').send();
	var destination_file = path.dirname(process.mainModule.filename)+path.sep+'config'+path.sep+'default.json';
	var source_file = path.dirname(process.mainModule.filename)+path.sep+'node_modules'+path.sep+'open-payments'+path.sep+'config'+path.sep+'default.json';
	fs.access(destination_file,fs.R_OK | fs.W_OK,function(err){
		if(err){
			fs.mkdir(path.dirname(process.mainModule.filename)+path.sep+'config');
			fs.writeFileSync(destination_file, fs.readFileSync(source_file));
			console.log('NOTICE: Creating default config file.  Please review "'+destination_file+ '"\nNOTICE: You may need to run your app again');
		}
	});
}
// *******************************************
// * This function is used to retrieve entity info
// * like entity name, address, and other entity 
// * specfic information.  This function is used  
// * in the summary method, or can be called
// * independantly with the information method.
// *******************************************
function entityInfo(entity){
	var t_pars = {utc:'information',utv:entity.type,utl:entity.id};
	var tick = new t.Tick("info");
	tick.start();
	visitor.event('information',entity.type,entity.id,0,ga_params).send();
	var options = {
        method: 'GET'
        ,uri: (entity.type=='company')?config.get("url")+config.get("supplement.data." + entity.type)+"?$where=amgpo_making_payment_id=%27"+entity.id+"%27":config.get("url")+config.get("supplement.data." + entity.type)+config.get("supplement.params."+entity.type)+"'"+entity.id+"'"
        ,gzip: true
        ,json: true
        ,auth: {
            user: config.get('auth.user')
            ,pass: config.get('auth.key')
            ,sendImmediately: true
		}
	};
	var results = JSON.parse(request(options.method,options.uri,options).getBody('utf8'));
	for(var key in results[0]){
		Covered_Recipient[key]=results[0][key];
	}
	tick.stop();
	var myTimer = t.timers.info;
	t_pars.utt = Math.round(myTimer.duration()/1000000);
	visitor.timing(t_pars).send();
}
// *******************************************
// * This is the main function for the module, it kinda
// * kicks off everything else.  I'm thinking of removing
// * it and just making it part of the summary method
// * above.  I'm open to input on best practices though
// *******************************************
function main(options){
	var tick = new t.Tick("summary");
	tick.start();
	visitor.event('summary',options.type,options.id,1,ga_params).send();
	var datasets = buildArr(options)  // Collects all the datasets from config.json
		,objProp = options.type + '_id';
	//Covered_Recipient[objProp] = options.id  // sets the covered recipient type based on user input
	datasets.forEach(function(e){
		// These are going to be frequently used parameters for most of the sub routines.  Looking for a better way to do this.
		temp_params = {program_year:e.year,payment_type:e.type,entity_id:options.id,entity_type:options.type};
		getResults();  // technically this function is where all the real work gets done
	});
	tick.stop();
	var myTimer = t.timers.summary;
	visitor.timing('summary',options.type,Math.round(myTimer.duration()/1000000),options.id).send();
}
// *******************************************
// * This function loops through the URI's created
// * in the buildArr function.  Essentially what
// * creates and starts the queries to get every
// * record for an entity.
// *******************************************
function getData(options){
	var tick = new t.Tick("getData");
	tick.start();
	queries = buildArr(options);
	var counter = 0;
	queries.forEach(function(query){
		if(!Covered_Recipient.hasOwnProperty(query.year)){Covered_Recipient[query.year]={}}
		if(!Covered_Recipient[query.year].hasOwnProperty(query.year)){
			Covered_Recipient[query.year][query.type]={
				'records':[ ]
			};
		}
		counter = counter + dataRequest(query,0);
	});
	visitor.event('records',options.type,options.id,counter,ga_params).send();
	tick.stop();
	var myTimer = t.timers.getData;
	visitor.timing('records',options.type,Math.round(myTimer.duration()/1000000),counter).send();
}
// *******************************************
// * This function makes the request to Socrata 
// * for all the records for an entity.  If the number
// * exceeds the 50000 limit, it loops until
// * no more data is found.
// *******************************************
function dataRequest(objInput,offset){
	var year = objInput.year;
	var ptype = objInput.type;
	var limit = 50000;
	var options = {
		method: 'GET'
		,uri: objInput.uri+"&$limit="+limit+"&$offset="+offset
		, gzip: true
		, json: true
  };
  var counter = 0;
  data = JSON.parse(request(options.method,options.uri,options).getBody('utf8'));
    if(!data.hasOwnProperty('message')){
        data.forEach(function(record){
            counter++;
            Covered_Recipient[objInput.year][objInput.type].records.push(record);
        });
        if(data.length==limit){
            offset = offset + data.length;
            dataRequest(objInput,offset);
        }
	}
	else{
		console.log('WARN: column "'+ data.data.data.column + '" doesn\'t exist in the ' + objInput.year + ' ' + objInput.type + ' dataset');
		console.log('NOTICE: Don\'t worry, we will still get it from the datasets it does exist in.');
	}
	return counter;
}
// *******************************************
// * This function reads the config file and stores 
// * all the url information for the datasets you 
// * want to query. It will return an array where 
// * each element contians program year, payment type,
// * and the dataset URL with no paramerters
// *******************************************
function buildArr(entity){
	var datasets = config.get('datasets');
	var temp = [];
	for (var key in datasets) {
        if (datasets.hasOwnProperty(key)) {
            var obj = datasets[key];
            for (var prop in obj) {
                if(entity.type!='hospital'||prop!='ownership'){
                    if(obj.hasOwnProperty(prop)){
                    	switch(entity.type){
                    		case 'company':
                    			temp.push({id:entity.id,'year':key,'type':prop,'uri':config.get("url")+obj[prop]+'?$where=applicable_manufacturer_or_applicable_gpo_making_payment_id=%27'+entity.id+'%27'});
                    			break;
                    		default:
                        		temp.push({id:entity.id,'year':key,'type':prop,'uri':config.get("url")+obj[prop]+config.get('supplement.params.'+entity.type)+'%27'+entity.id+'%27'});
                        }
                    }
                }else if(entity.type=='physician'&&prop=='pi'){
                    if(obj.hasOwnProperty(prop)){
                        temp.push({id:entity.id,'year':key,'type':prop,'uri':config.get("url")+obj[prop]+"$where=(physician_profile_id IS NULL OR physician_profile_id!=%27"+entity.id+"%27)%20AND%20(principal_investigator_1_profile_id=%27"+entity.id+"%27%20OR%20principal_investigator_2_profile_id=%27"+entity.id+"%27%20OR%20principal_investigator_3_profile_id=%27"+entity.id+"%27%20OR%20principal_investigator_4_profile_id=%27"+entity.id+"%27%20OR%20principal_investigator_5_profile_id=%27"+entity.id+"%27"});
                    }	
                }
            }
        }
	}
	return temp;
}
// *******************************************
// * This function is going to take all the dataset
// * URL's and add on the parameters based on several
// * elements like program year, or entity type.
// * It will return a URL string for the JSON request
// *******************************************
function buildURI(){
	switch(temp_params.payment_type){
		case 'pi':
			return config.get("url")+config.get("datasets." + temp_params.program_year + "." + temp_params.payment_type) + "?$$app_token="+config.get('auth.app_token')+"&$group=dispute_status_for_publication&$select=dispute_status_for_publication,sum(total_amount_of_payment_usdollars),%20count(record_id)&$where=(physician_profile_id IS NULL OR physician_profile_id!=%27"+temp_params.entity_id+"%27)%20AND%20(principal_investigator_1_profile_id=%27"+temp_params.entity_id+"%27%20OR%20principal_investigator_2_profile_id=%27"+temp_params.entity_id+"%27%20OR%20principal_investigator_3_profile_id=%27"+temp_params.entity_id+"%27%20OR%20principal_investigator_4_profile_id=%27"+temp_params.entity_id+"%27%20OR%20principal_investigator_5_profile_id=%27"+temp_params.entity_id+"%27)";
			break;
		default:
			return config.get("url")+config.get("datasets." + temp_params.program_year + "." + temp_params.payment_type) + "?$$app_token="+config.get('auth.app_token')+config.get('params.'+temp_params.payment_type) + config.get('supplement.params.'+temp_params.entity_type).substring(1) + "'"+temp_params.entity_id +"'";
	}
}
// *******************************************
// * This function will make the request to Socrata
// * based on the URL's from the datasets array above
// * and then send the JSON results to another function
// * which updates the output for this module.
// *******************************************
function getResults(){
	var options = {
        method: 'GET'
        ,uri: buildURI()
        ,gzip: true
        ,json: true
        ,auth: {
        user: config.get('auth.user')
            ,pass: config.get('auth.key')
            ,sendImmediately: true
        }
    };
	var results = request(options.method,options.uri,options).getBody('utf8');
	updateCR(results);
}
// *******************************************
// * This function takes the results from the getResults()
// * and sums them into an object that can be used
// * to view entity level summary data.
// * This is (I think) the messiest part of this whole
// * module.
// *******************************************
function updateCR(data){
	var arrResults = JSON.parse(data);
	if(arrResults.length>0){
		if(!(Covered_Recipient.hasOwnProperty(temp_params.program_year))){Covered_Recipient[temp_params.program_year]= {}}
		if(!(Covered_Recipient[temp_params.program_year].hasOwnProperty(temp_params.payment_type))){Covered_Recipient[temp_params.program_year][temp_params.payment_type]= {}}
		arrResults.forEach(function(element){
			if(Covered_Recipient[temp_params.program_year][temp_params.payment_type].count==null){Covered_Recipient[temp_params.program_year][temp_params.payment_type].count = Number(element.count_record_id)}
			else{Covered_Recipient[temp_params.program_year][temp_params.payment_type].count = Covered_Recipient[temp_params.program_year][temp_params.payment_type].count + Number(element.count_record_id)}
			switch(temp_params.payment_type){
				case 'ownership':
					if(Covered_Recipient[temp_params.program_year][temp_params.payment_type].interest==null){Covered_Recipient[temp_params.program_year][temp_params.payment_type].interest = Number(element.sum_value_of_interest)}
					else{Covered_Recipient[temp_params.program_year][temp_params.payment_type].interest = Covered_Recipient[temp_params.program_year][temp_params.payment_type].interest + Number(element.sum_value_of_interest)}
					if(Covered_Recipient[temp_params.program_year][temp_params.payment_type].value==null){Covered_Recipient[temp_params.program_year][temp_params.payment_type].value = Number(element.sum_total_amount_invested_usdollars)}
					else{Covered_Recipient[temp_params.program_year][temp_params.payment_type].value = Covered_Recipient[temp_params.program_year][temp_params.payment_type].value + Number(element.sum_total_amount_invested_usdollars)}
					break;
				default:
					if(Covered_Recipient[temp_params.program_year][temp_params.payment_type].value==null){Covered_Recipient[temp_params.program_year][temp_params.payment_type].value = Number(element.sum_total_amount_of_payment_usdollars)}
					else{Covered_Recipient[temp_params.program_year][temp_params.payment_type].value = Covered_Recipient[temp_params.program_year][temp_params.payment_type].value + Number(element.sum_total_amount_of_payment_usdollars)}
			}
			switch(element.dispute_status_for_publication){
				case 'Yes':
					if(Covered_Recipient[temp_params.program_year].disputes==null){Covered_Recipient[temp_params.program_year].disputes = Number(element.count_record_id)}
					else{Covered_Recipient[temp_params.program_year].disputes = Covered_Recipient[temp_params.program_year].disputes + Number(element.count_record_id)}
					break;
				case 'No':
					if(Covered_Recipient[temp_params.program_year].undisputes==null){Covered_Recipient[temp_params.program_year].undisputes = Number(element.count_record_id)}
					else{Covered_Recipient[temp_params.program_year].undisputes = Covered_Recipient[temp_params.program_year].undisputes + Number(element.count_record_id)}
					break;
			}
		});
	}
}
