# OpenPayments

This project is for creating re-usable node modules for querying Open Payments data via the Socrata API.

This is meant to be a module that other developers can use to build search tools for Open Payments data.

## Example
```
var data = require('individual');
options = {
 'id':268527  // This is a physician_profile_id in open payments
 ,'type': 'physician'  //  This is an entity type, later I will allow for more
}

var physician = data.query(options);  // This initiates the query
console.log('Results: ");
console.log(physician);
// or
console.log('Results: ");
console.log(physician[2014].general.value)
```
## Results
```
Results:
{ '2013':
   { general: { value: 31931.57, count: 81 },
     undisputes: 86,
     research: { value: 1525, count: 2 },
     ownership: { value: 127999.05, count: 3, interest: 67452.24 },
     pi: { value: 33510, count: 10 } },
  '2014':
   { general: { value: 1172184.0999999999, count: 203 },
     undisputes: 202,
     disputes: 6,
     research: { value: 5000, count: 1 },
     ownership: { value: 260228.14, count: 4, interest: 262942.14 },
     pi: { value: 67492.76, count: 31 } },
  physician_id: 268527 }
```
or
```
Results:
1172184.0999999999
```

## Prerequisites
- Node is required
- At the moment, and Socrata login, and app token.  This won't be required later
- A config.json file after installation that looks like this
```
{
	"auth":{
		"user":"YOUR-SOCRATA-USERNAME",
		"key":"YOUR-PASSWORD",
		"app_token":"YOUR-APP-TOKEN"
	},
	"datasets":{
		"2013":{
			"general":"https://openpaymentsdata.cms.gov/resource/7jmr-y7em.json",
			"research":"https://openpaymentsdata.cms.gov/resource/347h-8q4c.json",
			"ownership":"https://openpaymentsdata.cms.gov/resource/9dan-a5me.json",
			"pi":"https://openpaymentsdata.cms.gov/resource/347h-8q4c.json"
		},
		"2014":{
			"general":"https://openpaymentsdata.cms.gov/resource/y4mv-5s9j.json",
			"research":"https://openpaymentsdata.cms.gov/resource/qsvx-wh3i.json",
			"ownership":"https://openpaymentsdata.cms.gov/resource/rrmg-ctbf.json",
			"pi":"https://openpaymentsdata.cms.gov/resource/qsvx-wh3i.json"	
		}
	},
	"params":{
		"physician":{
			"general":"&$select=dispute_status_for_publication,sum(total_amount_of_payment_usdollars), count(record_id)&$group=dispute_status_for_publication&$where=physician_profile_id='",
			"research":"&$select=dispute_status_for_publication,sum(total_amount_of_payment_usdollars), count(record_id)&$group=dispute_status_for_publication&$where=physician_profile_id='",
			"ownership":"&$select=dispute_status_for_publication,sum(total_amount_invested_usdollars),sum(value_of_interest), count(record_id)&$group=dispute_status_for_publication&$where=physician_profile_id='"
		}
	}
}
```
 
## Setup
This package is published in NPM so to install you just need to do the following:
```
npm install open-payments
```
When I get my act together, it will accept a profile id as a arguement but for now just edit the app.js
